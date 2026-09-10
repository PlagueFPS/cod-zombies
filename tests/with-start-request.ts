import { requestHandler } from "@tanstack/react-start/server"

/** Runs `run` inside a TanStack Start request so `getRequestUrl()` can resolve. */
export async function withStartRequest<T>(request: Request, run: () => Promise<T>): Promise<T> {
	const { promise, resolve, reject } = Promise.withResolvers<T>()

	const handler = requestHandler(async () => {
		try {
			resolve(await run())
		} catch (error) {
			reject(error instanceof Error ? error : new Error(String(error)))
		}

		return new Response(null, { status: 204 })
	})

	await handler(request, {})

	return promise
}
