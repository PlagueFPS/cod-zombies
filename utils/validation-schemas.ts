import { Schema } from "effect"

export type TFeedbackForm = typeof FeedbackFormSchema.Type
export type TContactForm = typeof ContactFormSchema.Type
export type TNewsletterForm = typeof NewsletterFormSchema.Type

const QuestParamsSchema = Schema.Struct({
	game: Schema.OptionFromUndefinedOr(Schema.String),
})

const MainQuestParamsSchema = Schema.extend(
	QuestParamsSchema,
	Schema.Struct({
		map: Schema.OptionFromUndefinedOr(Schema.String),
	}),
)

const SideQuestParamsSchema = Schema.extend(
	QuestParamsSchema,
	Schema.Struct({
		map: Schema.OptionFromUndefinedOr(Schema.String),
		id: Schema.OptionFromUndefinedOr(Schema.String),
	}),
)

const ZombieParamsSchema = Schema.Struct({
	id: Schema.OptionFromUndefinedOr(Schema.String),
})

	const RelicParamsSchema = Schema.Struct({
		id: Schema.OptionFromUndefinedOr(Schema.String),
		game: Schema.OptionFromUndefinedOr(Schema.String),
	})

const ErrorPageSearchParamsSchema = Schema.Struct({
	message: Schema.OptionFromUndefinedOr(Schema.String),
})

export const decodeMainQuestParams = Schema.decodeUnknownSync(MainQuestParamsSchema)
export const decodeSideQuestParams = Schema.decodeUnknownSync(SideQuestParamsSchema)
export const decodeZombieParams = Schema.decodeUnknownSync(ZombieParamsSchema)
export const decodeRelicParams = Schema.decodeUnknownSync(RelicParamsSchema)
export const decodeErrorPageSearchParams = Schema.decodeUnknown(ErrorPageSearchParamsSchema)

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

export const FeedbackFormSchema = Schema.Struct({
	title: Schema.NonEmptyString,
	label: Schema.Literal("Bug", "Improvement", "Feature", "User Feedback").annotations({
		message: () => "Please select a label.",
	}),
	feedback: Schema.NonEmptyString.annotations({
		message: () => "Please enter some feedback.",
	}),
})

export const StandardFeedbackFormSchema = Schema.standardSchemaV1(FeedbackFormSchema)

export const validateFeedbackForm = Schema.validateEither(StandardFeedbackFormSchema)

export const NewsletterFormSchema = Schema.Struct({
	email: EmailSchema,
})

export const StandardNewsletterFormSchema = Schema.standardSchemaV1(NewsletterFormSchema)

export const ContactFormSchema = Schema.Struct({
	name: Schema.NonEmptyString.annotations({
		message: () => "Please enter your name.",
	}).pipe(Schema.compose(Schema.Trim)),
	email: EmailSchema,
	message: Schema.NonEmptyString.annotations({
		message: () => "Please enter a message.",
	}),
})

export const StandardContactFormSchema = Schema.standardSchemaV1(ContactFormSchema)

const TerminusCodeSchema = Schema.Struct({
	x: Schema.NumberFromString.pipe(Schema.between(0, 99)),
	y: Schema.NumberFromString.pipe(Schema.between(0, 99)),
	z: Schema.NumberFromString.pipe(Schema.between(0, 99)),
})

export const decodeTerminusCode = Schema.decodeEither(TerminusCodeSchema)

const RichLinkNodeSchema = Schema.Struct({
	text: Schema.NonEmptyString,
})

export const decodeRichLinkNode = Schema.decodeUnknownEither(RichLinkNodeSchema)

const ReckoningCodeSchema = Schema.Struct({
	letter1: Schema.Union(
		Schema.String.pipe(
			Schema.pattern(/^[A-Za-z]$/, {
				message: () => "Only letters A-Z are allowed.",
			}),
		),
		Schema.String.pipe(Schema.maxLength(0)),
	),
	letter2: Schema.Union(
		Schema.String.pipe(
			Schema.pattern(/^[A-Za-z]$/, {
				message: () => "Only letters A-Z are allowed.",
			}),
		),
		Schema.String.pipe(Schema.maxLength(0)),
	),
})

export const decodeReckoningCode = Schema.decodeUnknownEither(ReckoningCodeSchema)
