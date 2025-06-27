import { Data } from "effect"

export interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

interface CommonErrorProps {
  message?: string
  cause?: unknown
}

export class FetchError extends Data.TaggedError("FetchError")<CommonErrorProps> {}
export class ContactExistsError extends Data.TaggedError("ContactExistsError")<CommonErrorProps> {}
export class ContactNotFoundError extends Data.TaggedError("ContactNotFoundError")<CommonErrorProps> {}
export class TokenVerificationError extends Data.TaggedError("TokenVerificationError")<CommonErrorProps> {}
export class TokenExpirationError extends Data.TaggedError("TokenExpirationError")<CommonErrorProps> {}
export class TokenGenerationError extends Data.TaggedError("TokenGenerationError")<CommonErrorProps> {}
export class InvalidUnsubscribeLinkError extends Data.TaggedError("InvalidUnsubscribeLinkError")<CommonErrorProps> {}
export class ExpiredUnsubscribeLinkError extends Data.TaggedError("ExpiredUnsubscribeLinkError")<CommonErrorProps> {}
export class InvalidSubscribeLinkError extends Data.TaggedError("InvalidSubscribeLinkError")<CommonErrorProps> {}
export class ExpiredSubscribeLinkError extends Data.TaggedError("ExpiredSubscribeLinkError")<CommonErrorProps> {}
export class UpstreamProviderError extends Data.TaggedError("UpstreamProviderError")<CommonErrorProps> {}
export class EntryNotFoundError extends Data.TaggedError("EntryNotFoundError")<CommonErrorProps> {}
export class SchemaValidationError extends Data.TaggedError("SchemaValidationError")<CommonErrorProps> {}
export class AuthorizationError extends Data.TaggedError("AuthorizationError")<CommonErrorProps> {}
export class RevalidationError extends Data.TaggedError("RevalidationError")<CommonErrorProps> {}
export class StatusEnforcementError extends Data.TaggedError("StatusEnforcementError")<CommonErrorProps> {}
export class TextParseError extends Data.TaggedError("TextParseError")<CommonErrorProps> {}
export class JSONParseError extends Data.TaggedError("JSONParseError")<CommonErrorProps> {}
export class EmailProviderError extends Data.TaggedError("EmailProviderError")<CommonErrorProps> {}
export class GetContactError extends Data.TaggedError("GetContactError")<CommonErrorProps> {}
export class CreateContactError extends Data.TaggedError("CreateContactError")<CommonErrorProps> {}
export class RemoveContactError extends Data.TaggedError("RemoveContactError")<CommonErrorProps> {}
export class CreateBroadcastError extends Data.TaggedError("CreateBroadcastError")<CommonErrorProps> {}
export class SendBroadcastError extends Data.TaggedError("SendBroadcastError")<CommonErrorProps> {}
export class OGImageGenerationError extends Data.TaggedError("OGImageGenerationError")<CommonErrorProps> {}
export class GetEntriesError extends Data.TaggedError("GetEntriesError")<CommonErrorProps> {}
export class GetCacheValueError extends Data.TaggedError("GetCacheValueError")<CommonErrorProps> {}
export class SetCacheValueError extends Data.TaggedError("SetCacheValueError")<CommonErrorProps> {}
export class DeleteCacheValueError extends Data.TaggedError("DeleteCacheValueError")<CommonErrorProps> {}
export class StoreNewEntryError extends Data.TaggedError("StoreNewEntryError")<CommonErrorProps> {}
export class GetEntryStatusError extends Data.TaggedError("GetEntryStatusError")<CommonErrorProps> {}
export class UpdateEntryStatusError extends Data.TaggedError("UpdateEntryStatusError")<CommonErrorProps> {}
export class InvalidRequestError extends Data.TaggedError("InvalidRequestError")<CommonErrorProps> {}