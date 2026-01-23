import { Data } from "effect"

export interface ErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

export interface CommonErrorProps {
	message: string
	cause?: unknown
}

export class AuthorizationError extends Data.TaggedError("AuthorizationError")<CommonErrorProps> {}
export class JSONParseError extends Data.TaggedError("JSONParseError")<CommonErrorProps> {}
export class SendEmailError extends Data.TaggedError("SendEmailError")<CommonErrorProps> {}
export class OgImageGenerationError extends Data.TaggedError(
	"OGImageGenerationError",
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
export class ReadFileError extends Data.TaggedError("ReadFileError")<CommonErrorProps> {}
