import { Effect } from "effect"
import { Payload } from "@/lib/payload"
import { EntryNotFoundError } from "@/types/errors"

export const getMediaById = (id: string) =>
	Effect.gen(function* () {
		const payload = yield* Payload
		const media = yield* Effect.tryPromise({
			try: () =>
				payload.findByID({
					collection: "media",
					id,
					select: {
						filename: true,
						url: true,
						width: true,
						height: true,
					},
				}),
			catch: error =>
				new EntryNotFoundError({
					message: `Failed to get media with id ${id}`,
					cause: error,
				}),
		})

		return media
	}).pipe(
		Effect.withLogSpan("get_media_by_id"),
		Effect.annotateLogs({ id }),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.succeed(null)),
		Effect.ensureErrorType<never>(),
	)
