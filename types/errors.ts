import { Data } from "effect"

export interface ErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

interface CommonErrorProps {
	message: string
	cause?: unknown
}

export class ContactExistsError extends Data.TaggedError("ContactExistsError")<CommonErrorProps> {}
export class ContactNotFoundError extends Data.TaggedError(
	"ContactNotFoundError",
)<CommonErrorProps> {}
export class TokenVerificationError extends Data.TaggedError(
	"TokenVerificationError",
)<CommonErrorProps> {}
export class TokenExpirationError extends Data.TaggedError(
	"TokenExpirationError",
)<CommonErrorProps> {}
export class TokenGenerationError extends Data.TaggedError(
	"TokenGenerationError",
)<CommonErrorProps> {}
export class EntryNotFoundError extends Data.TaggedError("EntryNotFoundError")<CommonErrorProps> {}
export class AuthorizationError extends Data.TaggedError("AuthorizationError")<CommonErrorProps> {}
export class JSONParseError extends Data.TaggedError("JSONParseError")<CommonErrorProps> {}
export class SendEmailError extends Data.TaggedError("SendEmailError")<CommonErrorProps> {}
export class GetContactError extends Data.TaggedError("GetContactError")<CommonErrorProps> {}
export class CreateContactError extends Data.TaggedError("CreateContactError")<CommonErrorProps> {}
export class RemoveContactError extends Data.TaggedError("RemoveContactError")<CommonErrorProps> {}
export class CreateBroadcastError extends Data.TaggedError(
	"CreateBroadcastError",
)<CommonErrorProps> {}
export class SendBroadcastError extends Data.TaggedError("SendBroadcastError")<CommonErrorProps> {}
export class OgImageGenerationError extends Data.TaggedError(
	"OGImageGenerationError",
)<CommonErrorProps> {}
export class GetEntriesError extends Data.TaggedError("GetEntriesError")<CommonErrorProps> {}
export class GetCacheValueError extends Data.TaggedError("GetCacheValueError")<CommonErrorProps> {}
export class SetCacheValueError extends Data.TaggedError("SetCacheValueError")<CommonErrorProps> {}
export class SetEntryError extends Data.TaggedError("SetEntryError")<CommonErrorProps> {}
export class DeleteCacheValueError extends Data.TaggedError(
	"DeleteCacheValueError",
)<CommonErrorProps> {}
export class DeleteEntryError extends Data.TaggedError("DeleteEntryError")<CommonErrorProps> {}
export class UpdateEntryStatusError extends Data.TaggedError(
	"UpdateEntryStatusError",
)<CommonErrorProps> {}
export class InvalidRequestError extends Data.TaggedError(
	"InvalidRequestError",
)<CommonErrorProps> {}
export class MapConfigError extends Data.TaggedError("MapConfigError")<CommonErrorProps> {}
export class ZombieAttackNotFoundError extends Data.TaggedError(
	"ZombieAttackNotFoundError",
)<CommonErrorProps> {}
export class QuestMapNotFoundError extends Data.TaggedError(
	"QuestMapNotFoundError",
)<CommonErrorProps> {}
export class MapCategoryNotFoundError extends Data.TaggedError(
	"MapCategoryNotFoundError",
)<CommonErrorProps> {}
export class LoadFontDataError extends Data.TaggedError("LoadFontDataError")<CommonErrorProps> {}
export class RatelimitExceededError extends Data.TaggedError(
	"RatelimitExceededError",
)<CommonErrorProps> {}
export class LinearGetTeamError extends Data.TaggedError("LinearGetTeamError")<CommonErrorProps> {}
export class LinearCreateIssueError extends Data.TaggedError(
	"LinearCreateIssueError",
)<CommonErrorProps> {}
export class LinearGetIssueLabelsError extends Data.TaggedError(
	"LinearGetIssueLabelsError",
)<CommonErrorProps> {}
export class PreviewImageError extends Data.TaggedError("PreviewImageError")<CommonErrorProps> {}
export class PayloadFindByIDError extends Data.TaggedError(
	"PayloadFindByIDError",
)<CommonErrorProps> {}
export class RelationshipError extends Data.TaggedError("RelationshipError")<CommonErrorProps> {}
