import type { CommonErrorProps } from "@/types/errors"
import config from "@payload-config"
import { Data, Effect } from "effect"
import { getPayload } from "payload"

export class PayloadInitError extends Data.TaggedError("PayloadInitError")<CommonErrorProps> {}

export const Payload = Effect.tryPromise({
	try: () => getPayload({ config }),
	catch: error => new PayloadInitError({ message: "Failed to initialize payload", cause: error }),
})
