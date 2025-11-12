import { Schema } from "effect"

export type ZombieType = typeof ZombieTypeSchema.Type
export type MainQuestDifficulty = typeof MainQuestDifficultySchema.Type

const ZombieTypeSchema = Schema.Literal("Normal", "Special", "Elite", "Boss")
const MainQuestDifficultySchema = Schema.Literal("Easy", "Medium", "Hard")

export class PageParams extends Schema.TaggedClass<PageParams>()("PageParams", {
	id: Schema.OptionFromUndefinedOr(Schema.NonEmptyString),
	game: Schema.OptionFromUndefinedOr(Schema.NonEmptyString),
	map: Schema.OptionFromUndefinedOr(Schema.NonEmptyString),
}) {}

export class SearchParams extends Schema.TaggedClass<SearchParams>()("SearchParams", {
	page: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.positive()), {
		default: () => 1,
	}),
	type: Schema.ArrayEnsure(ZombieTypeSchema),
	difficulty: Schema.ArrayEnsure(MainQuestDifficultySchema),
	map: Schema.ArrayEnsure(Schema.NonEmptyString),
	game: Schema.ArrayEnsure(Schema.NonEmptyString),
	include: Schema.ArrayEnsure(Schema.NonEmptyString),
	exclude: Schema.ArrayEnsure(Schema.NonEmptyString),
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

export class FeedbackFormValues extends Schema.TaggedClass<FeedbackFormValues>()(
	"FeedbackFormValues",
	{
		title: Schema.NonEmptyString,
		label: Schema.Literal("Bug", "Improvement", "Feature", "User Feedback").annotations({
			message: () => "Please select a label.",
		}),
		feedback: Schema.NonEmptyString.annotations({
			message: () => "Please enter some feedback.",
		}),
	},
) {}

export const StandardFeedbackFormSchema = Schema.standardSchemaV1(FeedbackFormValues)

export class NewsletterFormValues extends Schema.TaggedClass<NewsletterFormValues>()(
	"NewsletterFormValues",
	{
		email: EmailSchema,
	},
) {}

export const StandardNewsletterFormSchema = Schema.standardSchemaV1(NewsletterFormValues)

export class ContactFormValues extends Schema.TaggedClass<ContactFormValues>()(
	"ContactFormValues",
	{
		name: Schema.NonEmptyString.annotations({
			message: () => "Please enter your name.",
		}).pipe(Schema.compose(Schema.Trim)),
		email: EmailSchema,
		message: Schema.NonEmptyString.annotations({
			message: () => "Please enter a message.",
		}),
	},
) {}

export const StandardContactFormSchema = Schema.standardSchemaV1(ContactFormValues)

export class TerminusCodeValues extends Schema.TaggedClass<TerminusCodeValues>()(
	"TerminusCodeValues",
	{
		x: Schema.NumberFromString.pipe(Schema.between(0, 99)),
		y: Schema.NumberFromString.pipe(Schema.between(0, 99)),
		z: Schema.NumberFromString.pipe(Schema.between(0, 99)),
	},
) {}

export const decodeParams = Schema.decodeUnknownSync(PageParams)
export const decodeSearchParams = Schema.decodeUnknownSync(SearchParams)
export const decodeTerminusCode = Schema.decodeUnknownEither(TerminusCodeValues)
export const decodeFeedbackForm = Schema.decodeUnknownEither(FeedbackFormValues)
