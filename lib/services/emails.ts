import { Effect, Redacted } from "effect"
import {
	type CreateEmailOptions,
	type CreateEmailRequestOptions,
	Resend,
} from "resend"
import { env } from "@/env"
import {
	SendEmailError,
} from "@/types/errors"

const resend = new Resend(Redacted.value(env.RESEND_API_KEY))

export class Email extends Effect.Service<Email>()("Email", {
	effect: Effect.gen(function* () {

		const sendEmail = (params: CreateEmailOptions, options?: CreateEmailRequestOptions) =>
			Effect.gen(function* () {
				const { data, error } = yield* Effect.promise(() => resend.emails.send(params, options))

				if (error) return yield* new SendEmailError({ message: error.message, cause: error })

				return data
			})

		return {
			sendEmail,
		} as const
	}).pipe(Effect.withLogSpan("email_default")),
}) {}
