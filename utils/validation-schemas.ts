import { Schema } from "effect"

export type TFeedbackForm = typeof FeedbackFormSchema.Type
export type TAllowedSlugs = typeof AllowedSlugsSchema.Type
export type TContactForm = typeof ContactFormSchema.Type
export type TNewsletterForm = typeof NewsletterFormSchema.Type

const EmailSchema = Schema.NonEmptyString.pipe(
	Schema.compose(Schema.Trim),
	Schema.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, {
		message: () => "Invalid Email",
	}),
	Schema.maxLength(256, { message: () => "Email should not be longer than 256 characters" }),
).annotations({ message: () => "Email is required" })

export const AllowedSlugsSchema = Schema.Literal("maps", "games", "side-quests", "zombies", "legal")

export const FeedbackFormSchema = Schema.Struct({
	title: Schema.NonEmptyString,
	label: Schema.Literal("Bug", "Improvement", "Feature", "User Feedback").annotations({
		message: () => "Label is required.",
	}),
	feedback: Schema.NonEmptyString.annotations({ message: () => "Feedback is required" }),
})

export const NewsletterFormSchema = Schema.Struct({
	email: EmailSchema,
})

export const ContactFormSchema = Schema.Struct({
	name: Schema.NonEmptyString.annotations({
		message: () => "Name is required",
	}).pipe(Schema.compose(Schema.Trim)),
	email: EmailSchema,
	message: Schema.NonEmptyString.annotations({ message: () => "Message is required" }),
})

const TerminusCodeSchema = Schema.Struct({
	x: Schema.NumberFromString.pipe(Schema.between(0, 99)),
	y: Schema.NumberFromString.pipe(Schema.between(0, 99)),
	z: Schema.NumberFromString.pipe(Schema.between(0, 99)),
})

export const decodeTerminusCode = Schema.decodeEither(TerminusCodeSchema)

const RichLinkNodeSchema = Schema.Struct({
	data: Schema.Struct({
		uri: Schema.String,
	}),
	content: Schema.Array(
		Schema.Struct({
			value: Schema.String,
		}),
	),
})

export const decodeRichLinkNode = Schema.decodeUnknownEither(RichLinkNodeSchema)
