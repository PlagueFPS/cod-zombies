import { Schema } from "effect"

export class OpengraphManifest extends Schema.Class<OpengraphManifest>("OpengraphManifest")({
	"main-quests": Schema.Record(Schema.String, Schema.Int),
	"side-quests": Schema.Record(Schema.String, Schema.Int),
	zombies: Schema.Record(Schema.String, Schema.Int),
}) {}

export type OpengraphKind = keyof typeof OpengraphManifest.Encoded

const FileMetadataSchema = Schema.Struct({
	lastModified: Schema.Int.annotate({ description: "Epoch timestamp of the last modification" }),
	lastModifiedFormatted: Schema.String.annotate({
		description: "Human-readable formatted date of the last modification",
	}),
})

const LastModifiedDataSchema = Schema.Struct({
	version: Schema.String,
	generated: Schema.String,
	files: Schema.Record(Schema.String, FileMetadataSchema),
})

export const encodeLastModifiedData = Schema.encodeEffect(
	Schema.fromJsonString(LastModifiedDataSchema),
)
export const decodeLastModifiedData = Schema.decodeUnknownEffect(
	Schema.fromJsonString(LastModifiedDataSchema),
)

const ParamsSchema = Schema.Struct({
	id: Schema.OptionFromOptionalNullOr(Schema.String),
	game: Schema.OptionFromOptionalNullOr(Schema.String),
	map: Schema.OptionFromOptionalNullOr(Schema.String),
	message: Schema.OptionFromOptionalNullOr(Schema.String),
	layer: Schema.OptionFromOptionalNullOr(Schema.String),
})

const emailGroup = Schema.makeFilterGroup(
	[
		Schema.isMaxLength(256, { message: "Email must be shorter than 256 characters." }),
		Schema.isTrimmed({ message: "Email must not contain any leading or trailing whitespace" }),
		Schema.isPattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, {
			message: "Please enter a valid email address.",
		}),
	],
	{
		title: "email",
		description: "represents a valid email address.",
	},
)

const RequiredEmailSchema = Schema.String.pipe(Schema.check(emailGroup))
const OptionalEmailSchema = Schema.optional(
	Schema.Union([Schema.Literal(""), Schema.Undefined, RequiredEmailSchema]),
)

export const FeedbackFormSchema = Schema.Struct({
	title: Schema.NonEmptyString,
	email: OptionalEmailSchema,
	feedback: Schema.NonEmptyString.annotate({
		message: "Feedback is required.",
	}),
})

export const NewsletterFormSchema = Schema.Struct({
	email: RequiredEmailSchema,
})

export const ContactFormSchema = Schema.Struct({
	name: Schema.NonEmptyString.annotate({
		message: "Please enter your name.",
	}),
	email: RequiredEmailSchema,
	message: Schema.NonEmptyString.annotate({
		message: "Please enter a message.",
	}),
})

const isValidInt = Schema.isBetween({ minimum: 0, maximum: 99 })
const TerminusCodeSchema = Schema.Struct({
	x: Schema.NumberFromString.pipe(Schema.check(Schema.isInt(), isValidInt)),
	y: Schema.NumberFromString.pipe(Schema.check(Schema.isInt(), isValidInt)),
	z: Schema.NumberFromString.pipe(Schema.check(Schema.isInt(), isValidInt)),
})

const RichLinkNodeSchema = Schema.Struct({
	text: Schema.NonEmptyString,
})

const isValidReckoningLetter = Schema.makeFilterGroup([
	Schema.isPattern(/^[A-Za-z]$/).annotate({
		message: "Only letters A-Z are allowed.",
	}),
	Schema.isMaxLength(1),
])

const ReckoningCodeSchema = Schema.Struct({
	letter1: Schema.String.pipe(Schema.check(isValidReckoningLetter)),
	letter2: Schema.String.pipe(Schema.check(isValidReckoningLetter)),
})

export type TFeedbackForm = typeof FeedbackFormSchema.Type
export type TContactForm = typeof ContactFormSchema.Type
export type TNewsletterForm = typeof NewsletterFormSchema.Type
export type FileMetadata = typeof FileMetadataSchema.Type
export type LastModifiedData = typeof LastModifiedDataSchema.Type
export type TTerminusCode = typeof TerminusCodeSchema.Encoded

export const StandardFeedbackFormSchema = Schema.toStandardSchemaV1(FeedbackFormSchema)
export const StandardContactFormSchema = Schema.toStandardSchemaV1(ContactFormSchema)
export const StandardNewsletterFormSchema = Schema.toStandardSchemaV1(NewsletterFormSchema)
export const decodeReckoningCode = Schema.decodeUnknownExit(ReckoningCodeSchema)
export const decodeParams = Schema.decodeUnknownSync(ParamsSchema)
export const decodeTerminusCode = Schema.decodeUnknownExit(TerminusCodeSchema)
export const decodeRichLinkNode = Schema.decodeUnknownExit(RichLinkNodeSchema)
export const validateFeedbackForm = Schema.decodeExit(StandardFeedbackFormSchema)
export const decodeOpengraphManifest = Schema.decodeEffect(Schema.fromJsonString(OpengraphManifest))
export const encodeOpengraphManifest = Schema.encodeEffect(Schema.fromJsonString(OpengraphManifest))
