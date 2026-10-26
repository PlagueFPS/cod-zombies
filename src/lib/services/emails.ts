import type {
	CreateBroadcastOptions,
	CreateBroadcastRequestOptions,
	CreateBroadcastResponseSuccess,
	CreateContactResponseSuccess,
	CreateEmailOptions,
	CreateEmailRequestOptions,
	CreateEmailResponseSuccess,
	GetContactResponseSuccess,
	RemoveContactsResponseSuccess,
} from "resend"
import { Config, Context, Effect, Layer, Option, Redacted, Schema } from "effect"

export class ResendError extends Schema.TaggedError<
	ResendError,
	{ readonly brand: unique symbol }
>()("ResendError", {
	message: Schema.String,
	cause: Schema.Defect(),
}) {}

export interface EmailService {
	readonly getContact: (
		email: string,
	) => Effect.Effect<Option.Option<GetContactResponseSuccess>, ResendError>
	readonly createContact: (
		email: string,
	) => Effect.Effect<CreateContactResponseSuccess, ResendError>
	readonly removeContact: (
		email: string,
	) => Effect.Effect<RemoveContactsResponseSuccess, ResendError>
	readonly sendEmail: (
		params: CreateEmailOptions,
		options?: CreateEmailRequestOptions,
	) => Effect.Effect<CreateEmailResponseSuccess, ResendError>
	readonly createBroadcast: (
		params: CreateBroadcastOptions,
		options?: CreateBroadcastRequestOptions,
	) => Effect.Effect<CreateBroadcastResponseSuccess, ResendError>
}

export class Email extends Context.Service<Email, EmailService>()(
	"cod-zombies/lib/services/emails/Email",
) {}

const makeEmail = Effect.gen(function* () {
	const apiKey = yield* Config.Redacted("RESEND_API_KEY")
	const audienceId = yield* Config.Redacted("RESEND_AUDIENCE_ID")
	const { Resend } = yield* Effect.promise(() => import("resend"))

	const resend = new Resend(Redacted.value(apiKey))

	const getContact = Effect.fn("Email.getContact")(function* (email: string) {
		const { data, error } = yield* Effect.promise(() => resend.contacts.get({ email }))

		if (error != null && error.name !== "not_found")
			return yield* ResendError.make({ message: error.message, cause: error })

		return Option.fromNullOr(data)
	})

	const createContact = Effect.fn("Email.createContact")(function* (email: string) {
		const { data, error } = yield* Effect.promise(() =>
			resend.contacts.create({
				segments: [{ id: Redacted.value(audienceId) }],
				email,
			}),
		)

		if (error != null) return yield* ResendError.make({ message: error.message, cause: error })

		return data
	})

	const removeContact = Effect.fn("Email.removeContact")(function* (email: string) {
		const { data, error } = yield* Effect.promise(() => resend.contacts.remove({ email }))

		if (error != null) return yield* ResendError.make({ message: error.message, cause: error })

		return data
	})

	const sendEmail = Effect.fn("Email.sendEmail")(function* (
		params: CreateEmailOptions,
		options?: CreateEmailRequestOptions,
	) {
		const { data, error } = yield* Effect.promise(() => resend.emails.send(params, options))

		if (error != null) return yield* ResendError.make({ message: error.message, cause: error })

		return data
	})

	const createBroadcast = Effect.fn("Email.createBroadcast")(function* (
		params: CreateBroadcastOptions,
		options?: CreateBroadcastRequestOptions,
	) {
		const { data, error } = yield* Effect.promise(() => resend.broadcasts.create(params, options))

		if (error != null) return yield* ResendError.make({ message: error.message, cause: error })

		return data
	})

	return Email.of({
		getContact,
		createContact,
		removeContact,
		sendEmail,
		createBroadcast,
	})
})

export const emailLayerNoDeps = Layer.effect(Email, makeEmail)

export const emailLayer = emailLayerNoDeps
