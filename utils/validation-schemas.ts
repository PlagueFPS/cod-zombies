import { Schema } from "effect"

const FileMetadataSchema = Schema.Struct({
	lastModified: Schema.String,
	lastModifiedFormatted: Schema.String,
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

const QuestParamsSchema = Schema.Struct({
	game: Schema.OptionFromUndefinedOr(Schema.String),
})

const MainQuestParamsSchema = Schema.Struct({
	...QuestParamsSchema.fields,
	map: Schema.OptionFromUndefinedOr(Schema.String),
})

const SideQuestParamsSchema = Schema.Struct({
	...QuestParamsSchema.fields,
	map: Schema.OptionFromUndefinedOr(Schema.String),
	id: Schema.OptionFromUndefinedOr(Schema.String),
})

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

const emailGroup = Schema.makeFilterGroup(
	[
		Schema.isPattern(
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
		).annotate({
			message: "Please enter a valid email address.",
			description: "a valid email address.",
		}),
		Schema.isMaxLength(256).annotate({ message: "Email must be shorted than 256 characters." }),
		Schema.isTrimmed().annotate({
			message: "Email must not contain any leading or trailing whitespace",
		}),
	],
	{
		title: "email",
		description: "represents a valid email address.",
	},
)

const EmailSchema = Schema.NonEmptyString.pipe(Schema.check(emailGroup)).annotate({
	message: "Please enter a valid email address.",
})

export const FeedbackFormSchema = Schema.Struct({
	title: Schema.NonEmptyString,
	email: Schema.optional(EmailSchema),
	feedback: Schema.NonEmptyString,
})

export const NewsletterFormSchema = Schema.Struct({
	email: EmailSchema,
})

export const ContactFormSchema = Schema.Struct({
	name: Schema.NonEmptyString.annotate({
		message: "Please enter your name.",
	}),
	email: EmailSchema,
	message: Schema.NonEmptyString.annotate({
		message: "Please enter a message.",
	}),
})

const isValidInt = Schema.isBetween({ minimum: 0, maximum: 99 })
const TerminusCodeSchema = Schema.Struct({
	x: Schema.NumberFromString.pipe(Schema.check(isValidInt)),
	y: Schema.NumberFromString.pipe(Schema.check(isValidInt)),
	z: Schema.NumberFromString.pipe(Schema.check(isValidInt)),
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

export const StandardFeedbackFormSchema = Schema.toStandardSchemaV1(FeedbackFormSchema)
export const StandardContactFormSchema = Schema.toStandardSchemaV1(ContactFormSchema)
export const StandardNewsletterFormSchema = Schema.toStandardSchemaV1(NewsletterFormSchema)
export const decodeReckoningCode = Schema.decodeUnknownExit(ReckoningCodeSchema)
export const decodeMainQuestParams = Schema.decodeUnknownSync(MainQuestParamsSchema)
export const decodeSideQuestParams = Schema.decodeUnknownSync(SideQuestParamsSchema)
export const decodeZombieParams = Schema.decodeUnknownSync(ZombieParamsSchema)
export const decodeRelicParams = Schema.decodeUnknownSync(RelicParamsSchema)
export const decodeErrorPageSearchParams = Schema.decodeUnknownEffect(ErrorPageSearchParamsSchema)
export const decodeTerminusCode = Schema.decodeExit(TerminusCodeSchema)
export const decodeRichLinkNode = Schema.decodeUnknownExit(RichLinkNodeSchema)
export const validateFeedbackForm = Schema.decodeExit(StandardFeedbackFormSchema)
