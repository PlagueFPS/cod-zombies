import { Effect } from "effect";
import { EmailProviderError } from "@/types/Error";
import { 
  Resend,
  type CreateBroadcastOptions, 
  type CreateBroadcastRequestOptions, 
  type CreateContactOptions, 
  type CreateContactRequestOptions, 
  type CreateEmailOptions, 
  type CreateEmailRequestOptions, 
  type GetContactOptions, 
  type RemoveContactOptions, 
  type SendBroadcastOptions,  
} from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY)

export class EmailService extends Effect.Service<EmailService>()("EmailService", {
  effect: Effect.gen(function*() {
    return {
      getContact: (params: GetContactOptions) => Effect.gen(function*() {
        const { data, error } = yield* Effect.tryPromise({
          try: () => resend.contacts.get(params),
          catch: (error) => new EmailProviderError({
            message: "Failed to get contact",
            cause: error
          })
        })

        if (error && error.name !== "not_found") return yield* Effect.fail(new EmailProviderError({
          message: "Failed to get contact",
          cause: error
        }))

        return data
      }),
      createContact: (params: CreateContactOptions, options?: CreateContactRequestOptions) => Effect.gen(function*() {
        const { data, error } = yield* Effect.tryPromise({
          try: () => resend.contacts.create(params, options),
          catch: (error) => new EmailProviderError({
            message: "Failed to create contact",
            cause: error
          })
        })

        if (error) return yield* Effect.fail(new EmailProviderError({
          message: "Failed to create contact",
          cause: error
        }))

        return data
      }),
      removeContact: (params: RemoveContactOptions) => Effect.gen(function*() {
        const { data, error } = yield* Effect.tryPromise({
          try: () => resend.contacts.remove(params),
          catch: (error) => new EmailProviderError({
            message: "Failed to remove contact",
            cause: error
          })
        })

        if (error) return yield* Effect.fail(new EmailProviderError({
          message: "Failed to remove contact",
          cause: error
        }))

        return data
      }),
      sendEmail: (params: CreateEmailOptions, options?: CreateEmailRequestOptions) => Effect.gen(function*() {
        const { data, error } = yield* Effect.tryPromise({
          try: () => resend.emails.send(params, options),
          catch: (error) => new EmailProviderError({
            message: "Failed to send email",
            cause: error
          })
        })

        if (error) return yield* Effect.fail(new EmailProviderError({
          message: "Failed to send email",
          cause: error
        }))

        return data
      }),
      createBroadcast: (params: CreateBroadcastOptions, options?: CreateBroadcastRequestOptions) => Effect.gen(function*() {
        const { data, error } = yield* Effect.tryPromise({
          try: () => resend.broadcasts.create(params, options),
          catch: (error) => new EmailProviderError({
            message: "Failed to create broadcast",
            cause: error
          })
        })

        if (error) return yield* Effect.fail(new EmailProviderError({
          message: "Failed to create broadcast",
          cause: error
        }))

        return data
      }),
      sendBroadcast: (id: string, payload?: SendBroadcastOptions) => Effect.gen(function*() {
        const { data, error } = yield* Effect.tryPromise({
          try: () => resend.broadcasts.send(id, payload),
          catch: (error) => new EmailProviderError({
            message: "Failed to send broadcast",
            cause: error
          })
        })

        if (error) return yield* Effect.fail(new EmailProviderError({
          message: "Failed to send broadcast",
          cause: error
        }))

        return data
      }),
    }
  }),
}) {}