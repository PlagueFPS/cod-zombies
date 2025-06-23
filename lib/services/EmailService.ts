import { Config, Context, Effect, Layer, Redacted } from "effect";
import { ContactNotFoundError, EmailProviderError } from "@/types/Error";
import { 
  Resend,
  type CreateBroadcastOptions, 
  type CreateBroadcastRequestOptions, 
  type CreateBroadcastResponseSuccess, 
  type CreateContactOptions, 
  type CreateContactRequestOptions, 
  type CreateContactResponseSuccess, 
  type CreateEmailOptions, 
  type CreateEmailRequestOptions, 
  type CreateEmailResponseSuccess, 
  type GetContactOptions, 
  type RemoveContactOptions, 
  type RemoveContactsResponseSuccess, 
  type SendBroadcastOptions,  
  type SendBroadcastResponseSuccess,
  type GetContactResponseSuccess
} from "resend";

export interface EmailServiceProps {
  readonly getContact: (params: GetContactOptions) => Effect.Effect<GetContactResponseSuccess, EmailProviderError | ContactNotFoundError, never>
  readonly createContact: (params: CreateContactOptions, options?: CreateContactRequestOptions) => Effect.Effect<CreateContactResponseSuccess, EmailProviderError, never>
  readonly removeContact: (params: RemoveContactOptions) => Effect.Effect<RemoveContactsResponseSuccess, EmailProviderError, never>
  readonly sendEmail: (params: CreateEmailOptions, options?: CreateEmailRequestOptions) => Effect.Effect<CreateEmailResponseSuccess, EmailProviderError, never>
  readonly createBroadcast: (params: CreateBroadcastOptions, options?: CreateBroadcastRequestOptions) => Effect.Effect<CreateBroadcastResponseSuccess, EmailProviderError, never>
  readonly sendBroadcast: (id: string, payload?: SendBroadcastOptions) => Effect.Effect<SendBroadcastResponseSuccess, EmailProviderError, never>
}

export class EmailService extends Context.Tag("EmailService")<
  EmailService,
  EmailServiceProps
>() {}

export const EmailServiceLive = Layer.succeed(
  EmailService,
  EmailService.of({
    getContact: (params) => 
      Effect.gen(function* () {
        const redactedApiKey = yield* Config.redacted("RESEND_API_KEY")
        const apiKey = Redacted.value(redactedApiKey)
        const resend = new Resend(apiKey)
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
      
        if (!data) return yield* Effect.fail(new ContactNotFoundError({
          message: "Failed to get contact",
          cause: new Error("No data was returned for the contact request.")
        }))
      
        return data
      }).pipe(
        Effect.catchTag("ConfigError", error => Effect.dieMessage(error.message))
      ),
      createBroadcast: (params, options) => 
        Effect.gen(function* () {
          const redactedApiKey = yield* Config.redacted("RESEND_API_KEY")
          const apiKey = Redacted.value(redactedApiKey)
          const resend = new Resend(apiKey)
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
        
          if (!data) return yield* Effect.fail(new EmailProviderError({
            message: "Failed to create broadcast",
            cause: new Error("No data was returned for the broadcast request.")
          }))
        
          return data
        }).pipe(
          Effect.catchTag("ConfigError", error => Effect.dieMessage(error.message))
        ),
      createContact: (params, options) => 
        Effect.gen(function* () {
          const redactedApiKey = yield* Config.redacted("RESEND_API_KEY")
          const apiKey = Redacted.value(redactedApiKey)
          const resend = new Resend(apiKey)
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
        
          if (!data) return yield* Effect.fail(new EmailProviderError({
            message: "Failed to create contact",
            cause: new Error("No data was returned for the contact request.")
          }))
        
          return data
        }).pipe(
          Effect.catchTag("ConfigError", error => Effect.dieMessage(error.message))
        ),
      removeContact: (params) => 
        Effect.gen(function* () {
          const redactedApiKey = yield* Config.redacted("RESEND_API_KEY")
          const apiKey = Redacted.value(redactedApiKey)
          const resend = new Resend(apiKey)
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
        
          if (!data) return yield* Effect.fail(new EmailProviderError({
            message: "Failed to remove contact",
            cause: new Error("No data was returned for the contact request.")
          }))
        
          return data
        }).pipe(
          Effect.catchTag("ConfigError", error => Effect.dieMessage(error.message))
        ),
      sendEmail: (params, options) => 
        Effect.gen(function* () {
          const redactedApiKey = yield* Config.redacted("RESEND_API_KEY")
          const apiKey = Redacted.value(redactedApiKey)
          const resend = new Resend(apiKey)
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
        
          if (!data) return yield* Effect.fail(new EmailProviderError({
            message: "Failed to send email",
            cause: new Error("No data was returned for the email request.")
          }))
        
          return data
        }).pipe(
          Effect.catchTag("ConfigError", error => Effect.dieMessage(error.message))
        ),
      sendBroadcast: (params, options) => 
        Effect.gen(function* () {
          const redactedApiKey = yield* Config.redacted("RESEND_API_KEY")
          const apiKey = Redacted.value(redactedApiKey)
          const resend = new Resend(apiKey)
          const { data, error } = yield* Effect.tryPromise({
            try: () => resend.broadcasts.send(params, options),
            catch: (error) => new EmailProviderError({
              message: "Failed to send broadcast",
              cause: error
            })
          })
        
          if (error) return yield* Effect.fail(new EmailProviderError({
            message: "Failed to send broadcast",
            cause: error
          }))
        
          if (!data) return yield* Effect.fail(new EmailProviderError({
            message: "Failed to send broadcast",
            cause: new Error("No data was returned for the broadcast request.")
          }))
        
          return data
        }).pipe(
          Effect.catchTag("ConfigError", error => Effect.dieMessage(error.message))
        ),
  })
)