import { Schema } from "effect"

export type TFeedbackForm = typeof FeedbackFormSchema.Type
export type TAllowedSlugs = typeof AllowedSlugsSchema.Type
export type TContactForm = typeof ContactFormSchema.Type
export type TNewsletterForm = typeof NewsletterFormSchema.Type

const EmailSchema = Schema.NonEmptyString.pipe(
	Schema.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
).annotations({ message: () => "Invalid Email" })

export const AllowedSlugsSchema = Schema.Literal("maps", "games", "side-quests", "zombies", "legal")

export const FeedbackFormSchema = Schema.Struct({
	title: Schema.optional(Schema.NonEmptyString),
	label: Schema.optional(
		Schema.Literal("idea", "issue", "question", "complaint", "featureRequest", "other"),
	),
	feedback: Schema.NonEmptyString.annotations({ message: () => "Feedback is required" }),
})

export const NewsletterFormSchema = Schema.Struct({
	email: EmailSchema,
})

export const ContactFormSchema = Schema.Struct({
	name: Schema.NonEmptyString.annotations({ message: () => "Name is required" }),
	email: EmailSchema,
	message: Schema.NonEmptyString.annotations({ message: () => "Message is required" }),
})

const TerminusCodeSchema = Schema.Struct({
	x: Schema.NumberFromString.pipe(Schema.greaterThanOrEqualTo(0), Schema.lessThanOrEqualTo(99)),
	y: Schema.NumberFromString.pipe(Schema.greaterThanOrEqualTo(0), Schema.lessThanOrEqualTo(99)),
	z: Schema.NumberFromString.pipe(Schema.greaterThanOrEqualTo(0), Schema.lessThanOrEqualTo(99)),
})

export const decodeTerminusCode = Schema.decodeEither(TerminusCodeSchema)

export const DraftModeSchema = Schema.Struct({
	pathname: Schema.NonEmptyString,
})
