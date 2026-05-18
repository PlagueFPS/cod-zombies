import { Effect, Schema } from "effect"

export class OpengraphManifest extends Schema.Class<OpengraphManifest>("OpengraphManifest")({
	"main-quests": Schema.Record(Schema.String, Schema.Int),
	"side-quests": Schema.Record(Schema.String, Schema.Int),
	zombies: Schema.Record(Schema.String, Schema.Int),
	relics: Schema.Record(Schema.String, Schema.Int),
}) {}

const ContentSchema = Schema.Struct({
	filePath: Schema.NonEmptyString,
})

const OpengraphSchema = Schema.Struct({
	kind: Schema.Literals(["main-quests", "side-quests", "zombies", "relics"]),
	id: Schema.NonEmptyString,
})

const ImageAPISchema = Schema.Struct({
	url: Schema.StringFromUriComponent.annotate({
		description: "The source URL of the image",
	}),
	w: Schema.NumberFromString.pipe(Schema.check(Schema.isInt())).annotate({
		description: "The width of the image",
	}),
	q: Schema.NumberFromString.pipe(
		Schema.check(Schema.isInt(), Schema.isGreaterThan(0), Schema.isLessThanOrEqualTo(100)),
	).annotate({
		description: "The quality of the image",
	}),
})

const MapConfigModuleSchema = Schema.Struct({
	config: Schema.Struct({
		layers: Schema.Struct({}),
	}),
})

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

const PageParamSchema = Schema.Int.pipe(Schema.check(Schema.isGreaterThan(0)), Schema.optionalKey)
const MultiValueParamSchema = Schema.ArrayEnsure(Schema.String).pipe(
	Schema.withDecodingDefaultKey(Effect.succeed([]), {
		encodingStrategy: "omit",
	}),
)

const MainQuestSearchParamsSchema = Schema.Struct({
	page: PageParamSchema,
	sort: Schema.optionalKey(Schema.String),
	game: MultiValueParamSchema,
	time: MultiValueParamSchema,
	difficulty: MultiValueParamSchema,
})

const SideQuestSearchParamsSchema = Schema.Struct({
	page: PageParamSchema,
	sort: Schema.optionalKey(Schema.String),
	game: MultiValueParamSchema,
	map: MultiValueParamSchema,
})

const BestiarySearchParamsSchema = Schema.Struct({
	page: PageParamSchema,
	sort: Schema.optionalKey(Schema.String),
	game: MultiValueParamSchema,
	map: MultiValueParamSchema,
	type: MultiValueParamSchema,
	weakness: MultiValueParamSchema,
})

const RelicSearchParamsSchema = Schema.Struct({
	page: PageParamSchema,
	sort: Schema.optionalKey(Schema.String),
	map: MultiValueParamSchema,
	type: MultiValueParamSchema,
})

const MapsSearchParamsSchema = Schema.Struct({
	game: MultiValueParamSchema,
})

const InteractiveMapSearchParamsSchema = Schema.Struct({
	include: MultiValueParamSchema,
	exclude: MultiValueParamSchema,
	layer: Schema.optionalKey(Schema.String),
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

const ErrorPageSchema = Schema.Struct({
	message: Schema.String,
})

export type TFeedbackForm = typeof FeedbackFormSchema.Type
export type FileMetadata = typeof FileMetadataSchema.Type
export type LastModifiedData = typeof LastModifiedDataSchema.Type
export type TTerminusCode = typeof TerminusCodeSchema.Encoded
export type OpengraphKind = keyof typeof OpengraphManifest.Encoded

export const StandardFeedbackFormSchema = Schema.toStandardSchemaV1(FeedbackFormSchema)
export const StandardContactFormSchema = Schema.toStandardSchemaV1(ContactFormSchema)
export const StandardNewsletterFormSchema = Schema.toStandardSchemaV1(NewsletterFormSchema)
export const StandardErrorPageSchema = Schema.toStandardSchemaV1(ErrorPageSchema)
export const StandardMainQuestSearchParamsSchema = Schema.toStandardSchemaV1(
	MainQuestSearchParamsSchema,
)
export const StandardSideQuestSearchParamsSchema = Schema.toStandardSchemaV1(
	SideQuestSearchParamsSchema,
)
export const StandardBestiarySearchParamsSchema = Schema.toStandardSchemaV1(
	BestiarySearchParamsSchema,
)
export const StandardRelicSearchParamsSchema = Schema.toStandardSchemaV1(RelicSearchParamsSchema)
export const StandardMapsSearchParamsSchema = Schema.toStandardSchemaV1(MapsSearchParamsSchema)
export const StandardInteractiveMapSearchParamsSchema = Schema.toStandardSchemaV1(
	InteractiveMapSearchParamsSchema,
)
export const StandardContentSchema = Schema.toStandardSchemaV1(ContentSchema)
export const StandardOpengraphSchema = Schema.toStandardSchemaV1(OpengraphSchema)
export const decodeMainQuestSearchParams = Schema.decodeUnknownExit(MainQuestSearchParamsSchema)
export const decodeBestiarySearchParams = Schema.decodeUnknownExit(BestiarySearchParamsSchema)
export const decodeInteractiveMapSearchParams = Schema.decodeUnknownExit(
	InteractiveMapSearchParamsSchema,
)
export const decodeTerminusCode = Schema.decodeUnknownExit(TerminusCodeSchema)
export const validateFeedbackForm = Schema.decodeExit(StandardFeedbackFormSchema)
export const decodeOpengraphManifest = Schema.decodeEffect(Schema.fromJsonString(OpengraphManifest))
export const encodeOpengraphManifest = Schema.encodeEffect(Schema.fromJsonString(OpengraphManifest))
export const encodeLastModifiedData = Schema.encodeEffect(
	Schema.fromJsonString(LastModifiedDataSchema),
)
export const decodeMapConfigModule = Schema.decodeUnknownEffect(MapConfigModuleSchema)
export const decodeImageParams = Schema.decodeUnknownEffect(ImageAPISchema)
