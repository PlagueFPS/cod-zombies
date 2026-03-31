import { Effect, Layer, Option, Redacted, Schema, ServiceMap } from "effect"
import {
	type CreateBroadcastOptions,
	type CreateBroadcastRequestOptions,
	type CreateBroadcastResponseSuccess,
	type CreateContactResponseSuccess,
	type CreateEmailOptions,
	type CreateEmailRequestOptions,
	type GetContactResponseSuccess,
	type RemoveContactsResponseSuccess,
	Resend,
	type SendBroadcastOptions,
	type SendBroadcastResponseSuccess,
} from "resend"
import { env } from "@/env"

class ResendError extends Schema.TaggedErrorClass<ResendError>()("ResendError", {
	message: Schema.String,
	cause: Schema.Unknown,
}) {}

export class Email extends ServiceMap.Service<Email>()("lib/services/emails", {
	make: Effect.sync(() => {
		const resend = new Resend(Redacted.value(env.RESEND_API_KEY))

		const getContact = Effect.fn("Email.getContact")(function* (email: string) {
			const { data, error } = yield* Effect.promise(() => resend.contacts.get({ email }))

			if (error && error.name !== "not_found")
				return yield* new ResendError({ message: error.message, cause: error })

			return Option.fromNullOr(data)
		})

		const createContact = Effect.fn("Email.createContact")(function* (email: string) {
			const { data, error } = yield* Effect.promise(() =>
				resend.contacts.create({
					segments: [{ id: Redacted.value(env.RESEND_AUDIENCE_ID) }],
					email,
				}),
			)

			if (error) return yield* new ResendError({ message: error.message, cause: error })

			return data
		})

		const removeContact = Effect.fn("Email.removeContact")(function* (email: string) {
			const { data, error } = yield* Effect.promise(() => resend.contacts.remove({ email }))

			if (error) return yield* new ResendError({ message: error.message, cause: error })

			return data
		})

		const sendEmail = Effect.fn("Email.sendEmail")(function* (
			params: CreateEmailOptions,
			options?: CreateEmailRequestOptions,
		) {
			const { data, error } = yield* Effect.promise(() => resend.emails.send(params, options))

			if (error) return yield* new ResendError({ message: error.message, cause: error })

			return data
		})

		const createBroadcast = Effect.fn("Email.createBroadcast")(function* (
			params: CreateBroadcastOptions,
			options?: CreateBroadcastRequestOptions,
		) {
			const { data, error } = yield* Effect.promise(() => resend.broadcasts.create(params, options))

			if (error) return yield* new ResendError({ message: error.message, cause: error })

			return data
		})

		const sendBroadcast = Effect.fn("Email.sendBroadcast")(function* (
			id: string,
			payload?: SendBroadcastOptions,
		) {
			const { data, error } = yield* Effect.promise(() => resend.broadcasts.send(id, payload))

			if (error) return yield* new ResendError({ message: error.message, cause: error })

			return data
		})

		return {
			getContact,
			createContact,
			removeContact,
			sendEmail,
			createBroadcast,
			sendBroadcast,
		} as const
	}),
}) {
	static layer = Layer.effect(this, this.make)

	static layerTest = Layer.effect(
		this,
		Effect.sync(() => {
			const getContact: (
				email: string,
			) => Effect.Effect<Option.Option<GetContactResponseSuccess>, ResendError, never> = email =>
				Effect.succeed(
					Option.some({
						id: "123",
						email,
						created_at: new Date().toISOString(),
						first_name: null,
						last_name: null,
						object: "contact",
						properties: {},
						unsubscribed: false,
					}),
				)

			const createContact: (
				email: string,
			) => Effect.Effect<CreateContactResponseSuccess, ResendError, never> = email =>
				Effect.succeed({
					id: "123",
					email,
					created_at: new Date().toISOString(),
					object: "contact",
				})

			const removeContact: (
				email: string,
			) => Effect.Effect<RemoveContactsResponseSuccess, ResendError, never> = email =>
				Effect.succeed({
					id: "123",
					email,
					created_at: new Date().toISOString(),
					contact: "123",
					deleted: true,
					object: "contact",
				})

			const sendEmail: (
				params: CreateEmailOptions,
				options?: CreateEmailRequestOptions,
			) => Effect.Effect<SendBroadcastResponseSuccess, ResendError, never> = () =>
				Effect.succeed({ id: "123" })

			const createBroadcast: (
				params: CreateBroadcastOptions,
				options?: CreateBroadcastRequestOptions,
			) => Effect.Effect<CreateBroadcastResponseSuccess, ResendError, never> = () =>
				Effect.succeed({ id: "123" })

			const sendBroadcast: (
				id: string,
				payload?: SendBroadcastOptions,
			) => Effect.Effect<SendBroadcastResponseSuccess, ResendError, never> = id =>
				Effect.succeed({ id })

			return { getContact, createContact, removeContact, sendEmail, createBroadcast, sendBroadcast }
		}),
	)
}
