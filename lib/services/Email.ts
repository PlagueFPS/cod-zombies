import { env } from "@/env";
import { Effect } from "effect";
import { CreateBroadcastError, CreateContactError, EmailProviderError, GetContactError, RemoveContactError, SendBroadcastError } from "@/types/Error";
import { 
  Resend,
  type CreateBroadcastOptions, 
  type CreateBroadcastRequestOptions, 
  type CreateEmailOptions, 
  type CreateEmailRequestOptions, 
  type SendBroadcastOptions,  
} from "resend";

const resend = new Resend(env.RESEND_API_KEY)

export class Email extends Effect.Service<Email>()("Email", {
  effect: Effect.gen(function*() {
    const getContact = (email: string) => Effect.gen(function*() {
      const { data, error } = yield* Effect.promise(() => 
        resend.contacts.get({ audienceId: env.RESEND_AUDIENCE_ID, email })
      )

      if (error && error.name !== "not_found") return yield* Effect.fail(new GetContactError({ cause: error }))

      return data
    })

    const createContact = (email: string) => Effect.gen(function*() {
      const { data, error } = yield* Effect.promise(() => 
        resend.contacts.create({ audienceId: env.RESEND_AUDIENCE_ID, email })
      )

      if (error) return yield* Effect.fail(new CreateContactError({ cause: error }))

      return data
    })

    const removeContact = (email: string) => Effect.gen(function*() {
      const { data, error } = yield* Effect.promise(() => 
        resend.contacts.remove({ audienceId: env.RESEND_AUDIENCE_ID, email })
      )

      if (error) return yield* Effect.fail(new RemoveContactError({ cause: error }))

      return data
    })

    const sendEmail = (params: CreateEmailOptions, options?: CreateEmailRequestOptions) => Effect.gen(function*() {
      const { data, error } = yield* Effect.promise(() => 
        resend.emails.send(params, options)
      )
      
      if (error) return yield* Effect.fail(new EmailProviderError({ cause: error }))

      return data
    })

    const createBroadcast = (params: CreateBroadcastOptions, options?: CreateBroadcastRequestOptions) => Effect.gen(function*() {
      const { data, error } = yield* Effect.promise(() => 
        resend.broadcasts.create(params, options)
      )

      if (error) return yield* Effect.fail(new CreateBroadcastError({ cause: error }))

      return data
    })

    const sendBroadcast = (id: string, payload?: SendBroadcastOptions) => Effect.gen(function*() {
      const { data, error } = yield* Effect.promise(() => 
        resend.broadcasts.send(id, payload)
      )

      if (error) return yield* Effect.fail(new SendBroadcastError({ cause: error }))

      return data
    })

    return { getContact, createContact, removeContact, sendEmail, createBroadcast, sendBroadcast } as const
  }),
}) {}