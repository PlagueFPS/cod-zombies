import { Schema } from "effect"

/** Union of all zombie types */
export type ZombieType = typeof ZombieTypeSchema.Type
/** Union of all main quest difficulties */
export type MainQuestDifficulty = typeof MainQuestDifficultySchema.Type

const ZombieTypeSchema = Schema.Literal("normal", "special", "elite", "boss")
const MainQuestDifficultySchema = Schema.Literal("easy", "medium", "hard")

export class PageParams extends Schema.Class<PageParams>("PageParams")({
	id: Schema.OptionFromUndefinedOr(Schema.NonEmptyString),
	game: Schema.OptionFromUndefinedOr(Schema.NonEmptyString),
	map: Schema.OptionFromUndefinedOr(Schema.NonEmptyString),
}) {}

export class SearchParams extends Schema.Class<SearchParams>("SearchParams")({
	page: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.positive()), {
		default: () => 1,
	}),
	type: Schema.optionalWith(Schema.ArrayEnsure(ZombieTypeSchema), { default: () => [] }),
	difficulty: Schema.optionalWith(Schema.ArrayEnsure(MainQuestDifficultySchema), {
		default: () => [],
	}),
	map: Schema.optionalWith(Schema.ArrayEnsure(Schema.NonEmptyString), { default: () => [] }),
	game: Schema.optionalWith(Schema.ArrayEnsure(Schema.NonEmptyString), { default: () => [] }),
	include: Schema.optionalWith(Schema.ArrayEnsure(Schema.NonEmptyString), { default: () => [] }),
	exclude: Schema.optionalWith(Schema.ArrayEnsure(Schema.NonEmptyString), { default: () => [] }),
	layer: Schema.OptionFromUndefinedOr(Schema.NonEmptyString),
	message: Schema.OptionFromUndefinedOr(Schema.NonEmptyString),
}) {}

const EmailSchema = Schema.NonEmptyString.annotations({
	message: () => "Please enter an email address",
})
	.pipe(
		Schema.compose(Schema.Trim),
		Schema.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, {
			message: () => "Please enter a valid email address",
		}),
		Schema.maxLength(256, {
			message: () => "Email cannot be more than 256 characters",
		}),
	)
	.annotations({ message: () => "Please enter a valid email address" })

export class FeedbackFormValues extends Schema.Class<FeedbackFormValues>("FeedbackFormValues")({
	title: Schema.NonEmptyString,
	label: Schema.Literal("Bug", "Improvement", "Feature", "User Feedback").annotations({
		message: () => "Please select a label.",
	}),
	feedback: Schema.NonEmptyString.annotations({
		message: () => "Please enter some feedback.",
	}),
}) {}

export const StandardFeedbackFormSchema = Schema.standardSchemaV1(FeedbackFormValues)

export class NewsletterFormValues extends Schema.Class<NewsletterFormValues>(
	"NewsletterFormValues",
)({
	email: EmailSchema,
}) {}

export const StandardNewsletterFormSchema = Schema.standardSchemaV1(NewsletterFormValues)

export class ContactFormValues extends Schema.Class<ContactFormValues>("ContactFormValues")({
	name: Schema.NonEmptyString.annotations({
		message: () => "Please enter your name.",
	}).pipe(Schema.compose(Schema.Trim)),
	email: EmailSchema,
	message: Schema.NonEmptyString.annotations({
		message: () => "Please enter a message.",
	}),
}) {}

export const StandardContactFormSchema = Schema.standardSchemaV1(ContactFormValues)

export class TerminusCodeValues extends Schema.Class<TerminusCodeValues>("TerminusCodeValues")({
	x: Schema.NumberFromString.pipe(Schema.between(0, 99)),
	y: Schema.NumberFromString.pipe(Schema.between(0, 99)),
	z: Schema.NumberFromString.pipe(Schema.between(0, 99)),
}) {}

export const decodeParams = Schema.decodeUnknownSync(PageParams)
export const decodeTerminusCode = Schema.decodeUnknownEither(TerminusCodeValues)
export const decodeFeedbackForm = Schema.decodeUnknownEither(FeedbackFormValues)
const decodeSearchParams = Schema.decodeUnknownSync(SearchParams)

export const parseSearchParams = (searchParams: URLSearchParams): SearchParams => {
	const result: Record<string, string | string[]> = {}

	for (const [key, value] of searchParams.entries()) {
		if (result[key]) {
			const existingValue = result[key]
			result[key] = Array.isArray(existingValue)
				? [...existingValue, value]
				: [existingValue, value]
		} else {
			result[key] = value
		}
	}

	try {
		return decodeSearchParams(result)
	} catch {
		return decodeSearchParams({})
	}
}
