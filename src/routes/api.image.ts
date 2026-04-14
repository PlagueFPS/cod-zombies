import * as NodeHttpClient from "@effect/platform-node/NodeHttpClient"
import { createFileRoute } from "@tanstack/react-router"
import { Effect, Schema } from "effect"
import * as HttpClient from "effect/unstable/http/HttpClient"
import { env } from "@/env"
import { decodeImageParams } from "@/utils/validation-schemas"

class ImageOptimizationError extends Schema.TaggedErrorClass<ImageOptimizationError>()(
	"ImageOptimizationError",
	{
		status: Schema.Number,
		cause: Schema.Unknown,
	},
) {}

let _sharp: typeof import("sharp") | undefined

export const Route = createFileRoute("/api/image")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				// This is a dev-only route for local runtime image optimization
				// To maintain consistency with production behavior
				if (env.VITE_VERCEL_ENV !== "development") {
					return new Response(null, { status: 403 })
				}

				return await Effect.gen(function* () {
					const requestUrl = new URL(request.url)
					const { searchParams } = requestUrl
					const { url, w, q } = yield* decodeImageParams(Object.fromEntries(searchParams))
					if (!url.startsWith("/")) {
						yield* Effect.logError("URL parameter must be a relative path")
						return new Response(null, { status: 400 })
					}

					const httpClient = (yield* HttpClient.HttpClient).pipe(HttpClient.filterStatusOk)
					const optimizedBuffer = yield* httpClient.get(`${requestUrl.origin}${url}`).pipe(
						Effect.flatMap(res => res.arrayBuffer),
						Effect.flatMap(arrBuf => optimizeImage(Buffer.from(arrBuf), w, q)),
						Effect.map(buffer => new Uint8Array(buffer)),
					)

					return new Response(optimizedBuffer, {
						headers: {
							"Content-Type": "image/webp",
							"Content-Length": optimizedBuffer.byteLength.toString(),
							"Cache-Control": "public, max-age=31536000, immutable",
							Vary: "Accept",
						},
					})
				}).pipe(
					Effect.withLogSpan("API.Image"),
					Effect.tapCause(cause => Effect.logError(cause)),
					Effect.catchTags({
						ImageOptimizationError: error =>
							Effect.succeed(
								new Response(null, {
									status: error.status,
								}),
							),
						SchemaError: _error => Effect.succeed(new Response(null, { status: 400 })),
					}),
					Effect.catch(_error => Effect.succeed(new Response(null, { status: 500 }))),
					Effect.provide(NodeHttpClient.layerFetch),
					Effect.runPromise,
				)
			},
		},
	},
})

const getSharp = Effect.fnUntraced(function* (concurrency: number | undefined | null) {
	if (_sharp) {
		return _sharp
	}

	_sharp = yield* Effect.tryPromise({
		try: async () => {
			const { createRequire } = await import("node:module")
			const require = createRequire(import.meta.url)
			return require("sharp") as typeof import("sharp")
		},
		catch: cause => new ImageOptimizationError({ status: 500, cause }),
	})

	if (_sharp.concurrency() > 1) {
		// Reducing concurrency should reduce the memory usage too.
		// We more aggressively reduce in dev but also reduce in prod.
		// https://sharp.pixelplumbing.com/api-utility#concurrency
		const divisor = process.env.NODE_ENV === "development" ? 4 : 2
		_sharp.concurrency(concurrency ?? Math.floor(Math.max(_sharp.concurrency() / divisor, 1)))
	}
	return _sharp
})

const optimizeImage = Effect.fnUntraced(function* (
	data: Buffer,
	width: number,
	quality: number,
	concurrency?: number | null,
) {
	const sharp = yield* getSharp(concurrency)
	const transformer = sharp(data).timeout({ seconds: 7 }).rotate()
	transformer.resize(width, undefined, {
		withoutEnlargement: true,
	})

	// Always output WebP, even if already WebP to apply quality settings
	transformer.webp({ quality })

	return yield* Effect.tryPromise({
		try: () => transformer.toBuffer(),
		catch: cause => new ImageOptimizationError({ status: 500, cause }),
	})
})
