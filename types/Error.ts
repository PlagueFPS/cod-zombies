import { Data } from "effect"

export interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export class FetchError extends Data.TaggedError("FetchError")<{ message: string, cause: Error | unknown }> {}
export class ContactExistsError extends Data.TaggedError("ContactExistsError")<{ message: string, cause: Error | unknown }> {}
export class ContactNotFoundError extends Data.TaggedError("ContactNotFoundError")<{ message: string, cause: Error | unknown }> {}
export class TokenVerificationError extends Data.TaggedError("TokenVerificationError")<{ message: string, cause: Error | unknown }> {}
export class TokenExpirationError extends Data.TaggedError("TokenExpirationError")<{ message: string, cause: Error | unknown }> {}
export class InvalidUnsubscribeLinkError extends Data.TaggedError("InvalidUnsubscribeLinkError")<{ message: string, cause: Error | unknown }> {}
export class ExpiredUnsubscribeLinkError extends Data.TaggedError("ExpiredUnsubscribeLinkError")<{ message: string, cause: Error | unknown }> {}
export class InvalidSubscribeLinkError extends Data.TaggedError("InvalidSubscribeLinkError")<{ message: string, cause: Error | unknown }> {}
export class ExpiredSubscribeLinkError extends Data.TaggedError("ExpiredSubscribeLinkError")<{ message: string, cause: Error | unknown }> {}
export class BroadcastDataError extends Data.TaggedError("BroadcastDataError")<{ message: string, cause: Error | unknown }> {}
export class UpstreamProviderError extends Data.TaggedError("UpstreamProviderError")<{ message: string, cause: Error | unknown }> {}
export class EntryNotFoundError extends Data.TaggedError("EntryNotFoundError")<{ message: string, cause: Error | unknown }> {}
export class SchemaValidationError extends Data.TaggedError("SchemaValidationError")<{ message: string, cause: Error | unknown }> {}
export class AuthorizationError extends Data.TaggedError("AuthorizationError")<{ message: string, cause: Error | unknown }> {}
export class RevalidationError extends Data.TaggedError("RevalidationError")<{ message: string, cause: Error | unknown }> {}
export class StatusEnforcementError extends Data.TaggedError("StatusEnforcementError")<{ message: string, cause: Error | unknown }> {}
export class TextParseError extends Data.TaggedError("TextParseError")<{ message: string, cause: Error | unknown }> {}
export class JSONParseError extends Data.TaggedError("JSONParseError")<{ message: string, cause: Error | unknown }> {}
export class EmailProviderError extends Data.TaggedError("EmailProviderError")<{ message: string, cause: Error | unknown }> {}