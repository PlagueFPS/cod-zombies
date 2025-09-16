import config from "@payload-config"
import { Effect } from "effect"
import { getPayload } from "payload"

// This still gives us helpful DI if we end up needing a mock implementation of Payload
export class Payload extends Effect.Service<Payload>()("Payload", {
	effect: Effect.gen(function* () {
		const payload = yield* Effect.tryPromise(() => getPayload({ config }))
		return payload
	}).pipe(Effect.withLogSpan("payload_default")),
}) {}
