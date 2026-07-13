import type { ReactNode } from "react"
import { runMain } from "@effect/platform-bun/BunRuntime"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { Array as Arr, Effect, FileSystem, Match, Option, Path, Schema, Semaphore } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import { render } from "takumi-js"
import { getAmmoModByKey, type AmmoMod, type AmmoModKey } from "@/data/ammo-mods"
import { getGameByKey, type GameKey } from "@/data/games"
import {
	getMapByKey,
	getMapsWithMainQuest,
	type MainQuestDifficulty,
	type MapEntry,
	type MapKey,
} from "@/data/maps"
import { getRelicByKey, getRelics, type Relic, type RelicKey, type RelicType } from "@/data/relics"
import {
	getSideQuestByKey,
	getSideQuests,
	type SideQuest,
	type SideQuestKey,
} from "@/data/side-quests"
import { getWeakPointByKey } from "@/data/weak-points"
import { getZombieAttackByKey } from "@/data/zombie-attacks"
import {
	getZombieByKey,
	getZombies,
	type Zombie,
	type ZombieKey,
	type ZombieType,
} from "@/data/zombies"
import { getMdxDocumentMetaFromSource } from "@/lib/remark-mdx-meta"
import { DATE_OPTIONS } from "@/utils/constants"
import { formatEstimatedTimeRange } from "@/utils/shared-functions"
import {
	decodeOpengraphManifest,
	encodeOpengraphManifest,
	OpengraphManifest,
	type OpengraphKind,
} from "@/utils/validation-schemas"
import stylesheet from "@/globals.css?inline"
import geistMonoCss from "@fontsource-variable/geist-mono/wght.css?inline"

/** App CSS + Geist Mono only for OG renders (Mono is not loaded on the site). */
const ogStylesheets = [stylesheet, geistMonoCss]

const OPENGRAPH_KINDS = [
	"main-quests",
	"side-quests",
	"zombies",
	"relics",
] as const satisfies readonly OpengraphKind[]

const DEFAULT_OUTPUT_BASE = "public/opengraph-images"

/** When set (e.g. in tests), overrides the manifest path so CLI runs do not mutate repo `data/`. */
const manifestPathFromEnv = () =>
	process.env.OG_TEST_MANIFEST_PATH?.length ? process.env.OG_TEST_MANIFEST_PATH : undefined

export class ImageGenerationError extends Schema.TaggedErrorClass<ImageGenerationError>()(
	"ImageGenerationError",
	{
		cause: Schema.Defect(),
	},
) {}

export class OgCliError extends Schema.TaggedErrorClass<OgCliError>()("OgCliError", {
	message: Schema.String,
}) {}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const
/** `.dark --primary` in `globals.css` */
const PRIMARY = "oklch(0.705 0.213 47.604)"
const FG = "oklch(0.955 0 0)"
/** `.dark --muted-foreground` — used for meta labels in CLI OG (oklch for accuracy vs rgba). */
const MUTED_FG = "oklch(0.708 0 0)"
const CARD_SURFACE = "oklch(0.205 0 0)"
const BORDER = "oklch(1 0 0 / 10%)"
/** Zombie backdrop color */
const Z_BG = "oklch(0.145 0 0)"
/** Loaded only via `ogStylesheets` — not part of the site CSS. */
const OG_FONT_MONO = "Geist Mono Variable, ui-monospace, monospace"

/** ISO `YYYY-MM-DD` calendar day → long date in en-US; UTC avoids shifting the printed day by local TZ. */
function formatMapReleaseDay(isoDateOnly: string): string {
	return new Intl.DateTimeFormat("en-US", { ...DATE_OPTIONS, timeZone: "UTC" }).format(
		new Date(`${isoDateOnly}T00:00:00Z`),
	)
}

const clampWords = (text: string, maxChars: number) => {
	const t = text.trim().replace(/\s+/g, " ")
	if (t.length <= maxChars) {
		return t
	}
	const slice = t.slice(0, maxChars)
	const i = slice.lastIndexOf(" ")
	return `${(i > maxChars * 0.5 ? slice.slice(0, i) : slice).trimEnd()}…`
}

const difficultyCrumbColor = (difficulty: MainQuestDifficulty) =>
	Match.value(difficulty).pipe(
		Match.when("Easy", () => "oklch(91% 0.096 180.426)"),
		Match.when("Medium", () => "oklch(94.5% 0.129 101.54)"),
		Match.when("Hard", () => "oklch(88.5% 0.062 18.334)"),
		Match.when("Very Hard", () => "oklch(80.8% 0.114 19.571)"),
		Match.exhaustive,
	)

/** Gradient under the title + blurb; always brand orange. */
const TITLE_BLURB_SEPARATOR_GRADIENT = `linear-gradient(90deg, ${PRIMARY} 0%, rgba(255,255,255,0.12) 55%, transparent 100%)`

const metaColumn = (label: string, value: string) => (
	<div tw="flex flex-col gap-1 pr-2">
		<span tw="text-lg font-bold uppercase tracking-[0.07em]" style={{ color: MUTED_FG }}>
			{label}
		</span>
		<span tw="text-xl text-white leading-none font-semibold">{value}</span>
	</div>
)

/** Breadcrumb separator; fixed box + flex centers the glyph with 15px labels. */
const BreadcrumbBullet = () => (
	<span
		tw="flex shrink-0 items-center justify-center"
		style={{
			color: PRIMARY,
			width: 20,
			height: 15,
			fontSize: 13,
			lineHeight: "15px",
			fontWeight: 700,
		}}
		aria-hidden
	>
		•
	</span>
)

interface OgQuestImageProps {
	sectionLabel: "MAIN QUESTS" | "SIDE QUESTS"
	mapId: string
	gameTitle: string
	thirdCrumb: ReactNode
	blurb: string
	displayTitle: string
	titlePx: number
	titleTracking: string
	footerMeta: ReactNode
}

function OgQuestImage({
	sectionLabel,
	mapId,
	gameTitle,
	thirdCrumb,
	blurb,
	displayTitle,
	titlePx,
	titleTracking,
	footerMeta,
}: OgQuestImageProps) {
	return (
		<div tw="flex h-full w-full relative overflow-hidden">
			<img
				src={`${mapId}-image`}
				alt=""
				tw="absolute inset-0 w-full h-full object-cover"
				style={{ transform: "scale(1.05)" }}
			/>

			<div
				tw="absolute inset-0 w-full h-full"
				style={{
					background:
						"linear-gradient(180deg, rgba(9,9,11,0.58) 0%, rgba(9,9,11,0.22) 40%, rgba(9,9,11,0.08) 55%, rgba(9,9,11,0.72) 100%)",
				}}
			/>
			<div
				tw="absolute inset-0 w-full h-full"
				style={{
					background:
						"linear-gradient(90deg, rgba(9,9,11,0.94) 0%, rgba(9,9,11,0.52) 42%, rgba(9,9,11,0.18) 70%, rgba(12,10,8,0.45) 100%)",
				}}
			/>

			<div tw="flex flex-col h-full w-full relative z-10 pb-20 pl-14 pr-14 pt-14">
				<div tw="flex w-full shrink-0 flex-row items-center justify-between gap-6">
					<div tw="min-w-0 flex-1 flex flex-row items-center">
						<div tw="flex flex-row items-center flex-wrap gap-x-1 gap-y-1">
							<span
								tw="text-lg font-semibold leading-[15px]"
								style={{
									color: "rgba(250,250,250,0.96)",
									letterSpacing: "0.07em",
								}}
							>
								{sectionLabel}
							</span>
							<BreadcrumbBullet />
							<span
								tw="text-lg font-bold uppercase leading-[15px]"
								style={{
									color: "rgba(244,244,245,0.97)",
									letterSpacing: "0.07em",
									textShadow: "0 1px 14px rgba(0,0,0,0.55)",
								}}
							>
								{gameTitle}
							</span>
							<BreadcrumbBullet />
							{thirdCrumb}
						</div>
					</div>
					<div tw="flex shrink-0 flex-row items-center">
						<div
							tw="flex h-16 w-16 shrink-0 items-center justify-center rounded-full p-2"
							style={{
								background: "rgba(12, 12, 14, 0.76)",
								border: "1px solid rgba(255,255,255,0.1)",
								boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 24px rgba(0,0,0,0.35)",
							}}
						>
							<img src="site-logo" alt="" tw="h-9 w-auto max-h-9 max-w-[36px] object-contain" />
						</div>
					</div>
				</div>

				<div tw="flex flex-1 flex-col justify-center min-h-0 w-full">
					<div tw="flex flex-col max-w-[780px] gap-3">
						<h1
							tw="text-white font-black leading-[1.05] max-w-[800px]"
							style={{
								fontSize: titlePx,
								letterSpacing: titleTracking,
								textShadow: "0 2px 32px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.12)",
							}}
						>
							{displayTitle}
						</h1>

						<div tw="max-w-[640px] h-px" style={{ background: TITLE_BLURB_SEPARATOR_GRADIENT }} />

						<p
							tw="text-[21px] leading-[1.45] max-w-[680px] -mt-1.5 font-semibold"
							style={{ color: FG }}
						>
							{blurb}
						</p>
					</div>
				</div>

				<div tw="flex shrink-0 flex-row flex-wrap items-end gap-x-10 gap-y-4 w-full mt-6 pt-2">
					{footerMeta}
				</div>
			</div>
		</div>
	)
}

const ZOMBIE_TYPE_OG_COLOR: Record<ZombieType, string> = {
	Normal: "oklch(91% 0.096 180.426)",
	Special: "oklch(94.5% 0.129 101.54)",
	Elite: "oklch(89.2% 0.058 10.001)",
	Boss: "oklch(88.5% 0.062 18.334)",
}

/** Aligns with `TypeBadge` + `dark-*-badge-*-gradient` (Grim=easy, Sinister=medium, Wicked=hard). */
const RELIC_TYPE_OG_COLOR: Record<RelicType, string> = {
	Grim: "oklch(91% 0.096 180.426)",
	Sinister: "oklch(94.5% 0.129 101.54)",
	Wicked: "oklch(88.5% 0.062 18.334)",
}

/** Relic OG route backdrop overlay — softer than zombie OG gradient. */
const RELIC_OG_BACKDROP_OVERLAY =
	"linear-gradient(165deg, oklch(0.145 0 0 / 0.71) 0%, oklch(0.145 0 0 / 0.75) 45%, oklch(0.145 0 0 / 0.73) 100%)"

const OG_PORTRAIT_COL = { w: 380, padL: 40, padR: 28, frame: 300 } as const
const OG_TYPE_OVERLAY_TOP_PX = 36
const OG_LOGO_ROW_H_PX = 44
const ogPortraitFrameLeftPx =
	OG_PORTRAIT_COL.padL +
	(OG_PORTRAIT_COL.w - OG_PORTRAIT_COL.padL - OG_PORTRAIT_COL.padR - OG_PORTRAIT_COL.frame) / 2

const clampText = (text: string, maxChars: number) => {
	const t = text.trim().replace(/\s+/g, " ")
	if (t.length <= maxChars) {
		return t
	}
	const slice = t.slice(0, maxChars)
	const i = slice.lastIndexOf(" ")
	return `${(i > maxChars * 0.55 ? slice.slice(0, i) : slice).trimEnd()}…`
}

const OG_AMMO_ICON_PX = 52

const resolveAmmoModForOg = (key: AmmoModKey, game: GameKey | undefined): AmmoMod | null =>
	Option.getOrNull(getAmmoModByKey(key, game)) ?? Option.getOrNull(getAmmoModByKey(key))

const renderOg = (
	element: Parameters<typeof render>[0],
	options: NonNullable<Parameters<typeof render>[1]>,
) =>
	Effect.tryPromise({
		try: () => render(element, options),
		catch: cause => new ImageGenerationError({ cause }),
	}).pipe(Effect.map(data => new Uint8Array(data)))

export const generateMainQuestImage = Effect.fnUntraced(
	function* (map: MapEntry) {
		if (map.state.valueOrUndefined === "Coming Soon") {
			return yield* new ImageGenerationError({ cause: new Error("Map is Coming Soon") })
		}

		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const mainQuestPath = yield* map.mainQuest.pipe(Effect.fromOption)
		const contentPath = path.join(process.cwd(), "src", `${mainQuestPath}.mdx`)
		const fileContent = yield* fs.readFileString(contentPath)

		const mapImage = yield* fs.readFile(path.join(process.cwd(), "public", map.image))
		const siteLogo = yield* fs.readFile(path.join(process.cwd(), "public", "/logo.webp"))

		const timeToRead = getMdxDocumentMetaFromSource(fileContent).timeToRead
		const estTime = map.estimatedTimeMins.pipe(
			Option.map(r => formatEstimatedTimeRange(r)),
			Option.getOrThrow,
		)
		const game = yield* getGameByKey(map.game).pipe(Effect.fromOption)
		const difficulty = yield* map.difficulty.pipe(Effect.fromOption)
		const dateStr = formatMapReleaseDay(map.releaseDate)
		const blurb = clampWords(map.description, 200)
		const displayTitle = map.title.toLocaleUpperCase("en-US")
		const titleLen = displayTitle.length
		const titlePx = titleLen > 24 ? 48 : titleLen > 18 ? 54 : titleLen > 14 ? 62 : 70
		const titleTracking = titleLen > 22 ? "-0.01em" : "0.002em"

		const thirdCrumb = (
			<span
				tw="text-lg font-bold uppercase leading-[15px]"
				style={{
					color: difficultyCrumbColor(difficulty),
					letterSpacing: "0.07em",
					textShadow: "0 1px 14px rgba(0,0,0,0.55)",
				}}
			>
				{difficulty}
			</span>
		)

		const footerMeta = (
			<>
				{estTime ? metaColumn("Est. run", estTime) : null}
				{timeToRead != null ? metaColumn("Guide read", `${timeToRead} min`) : null}
				{metaColumn("Map drop", dateStr)}
			</>
		)

		return yield* renderOg(
			<OgQuestImage
				sectionLabel="MAIN QUESTS"
				mapId={map.id}
				gameTitle={game.title}
				thirdCrumb={thirdCrumb}
				blurb={blurb}
				displayTitle={displayTitle}
				titlePx={titlePx}
				titleTracking={titleTracking}
				footerMeta={footerMeta}
			/>,
			{
				format: "jpeg",
				...OG_IMAGE_SIZE,
				stylesheets: ogStylesheets,
				persistentImages: [
					{ data: mapImage, src: `${map.id}-image` },
					{ data: siteLogo, src: "site-logo" },
				],
			},
		)
	},
	self => Effect.withLogSpan(self, "generateMainQuestImage"),
)

export const generateSideQuestImage = Effect.fnUntraced(
	function* (sideQuest: SideQuest) {
		if (sideQuest.state.valueOrUndefined === "Coming Soon") {
			return yield* new ImageGenerationError({ cause: new Error("Side Quest is Coming Soon") })
		}

		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const contentPath = path.join(process.cwd(), "src", `${sideQuest.content}.mdx`)
		const fileContent = yield* fs.readFileString(contentPath)
		const map = yield* getMapByKey(sideQuest.map).pipe(Effect.fromOption)
		const game = yield* getGameByKey(map.game).pipe(Effect.fromOption)
		const mapImage = yield* fs.readFile(path.join(process.cwd(), "public", map.image))
		const siteLogo = yield* fs.readFile(path.join(process.cwd(), "public", "/logo.webp"))

		const timeToRead = getMdxDocumentMetaFromSource(fileContent).timeToRead
		const dateStr = formatMapReleaseDay(map.releaseDate)
		const blurb = clampWords(sideQuest.description, 200)
		const displayTitle = sideQuest.title.toLocaleUpperCase("en-US")
		const titleLen = displayTitle.length
		const titlePx = titleLen > 24 ? 48 : titleLen > 18 ? 54 : titleLen > 14 ? 62 : 70
		const titleTracking = titleLen > 22 ? "-0.01em" : "0.002em"

		const thirdCrumb = (
			<span
				tw="text-lg font-bold uppercase leading-[15px]"
				style={{
					color: PRIMARY,
					letterSpacing: "0.07em",
					textShadow: "0 1px 14px rgba(0,0,0,0.55)",
				}}
			>
				{map.title}
			</span>
		)

		const footerMeta = (
			<>
				{timeToRead != null ? metaColumn("Guide read", `${timeToRead} min`) : null}
				{metaColumn("Map drop", dateStr)}
			</>
		)

		return yield* renderOg(
			<OgQuestImage
				sectionLabel="SIDE QUESTS"
				mapId={map.id}
				gameTitle={game.title}
				thirdCrumb={thirdCrumb}
				blurb={blurb}
				displayTitle={displayTitle}
				titlePx={titlePx}
				titleTracking={titleTracking}
				footerMeta={footerMeta}
			/>,
			{
				format: "jpeg",
				...OG_IMAGE_SIZE,
				stylesheets: ogStylesheets,
				persistentImages: [
					{ data: mapImage, src: `${map.id}-image` },
					{ data: siteLogo, src: "site-logo" },
				],
			},
		)
	},
	self => Effect.withLogSpan(self, "generateSideQuestImage"),
)

export const generateZombieImage = Effect.fnUntraced(
	function* (zombie: Zombie) {
		if (zombie.state.valueOrUndefined === "Coming Soon") {
			return yield* new ImageGenerationError({ cause: new Error("Zombie is Coming Soon") })
		}

		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path

		const debutMapKey = yield* Arr.head(zombie.maps).pipe(Effect.fromOption)
		const debutMap = yield* getMapByKey(debutMapKey).pipe(Effect.fromOption)
		const debutGameKey = yield* Arr.head(zombie.games).pipe(Effect.fromOption)

		const weakPointTitle = (key: (typeof zombie.weakPoints)[number]) =>
			getWeakPointByKey(key).pipe(
				Option.map(w => w.title),
				Option.getOrElse(() => key),
			)

		const weakLabels = zombie.weakPoints.map(weakPointTitle)
		const hasWeakPoints = zombie.weakPoints.length > 0

		const hasElemental = zombie.elementalWeakness.length > 0
		const elementalModsOrdered = hasElemental
			? zombie.elementalWeakness
					.map(k => resolveAmmoModForOg(k, debutGameKey))
					.filter(m => m !== null)
			: []
		const ammoPersistentImages: Array<{ data: Uint8Array; src: string }> = []
		if (hasElemental) {
			yield* Effect.forEach(
				elementalModsOrdered,
				mod =>
					Effect.gen(function* () {
						const ammoImagePath = path.join(process.cwd(), "public", mod.image.replace(/^\/+/, ""))
						const data = yield* fs.readFile(ammoImagePath)
						ammoPersistentImages.push({ data, src: mod.id })
					}),
				{ concurrency: "unbounded" },
			)
		}

		const attackTitle = (key: (typeof zombie.attacks)[number]) =>
			getZombieAttackByKey(key).pipe(
				Option.map(a => a.title),
				Option.getOrElse(() => key),
			)
		const attackLabels = zombie.attacks.map(attackTitle)
		const attackStr = attackLabels.length ? attackLabels.join(" · ") : "—"
		const attacksOnlyStat = !hasWeakPoints && !hasElemental

		const zombieImagePath = path.join(process.cwd(), "public", zombie.image.replace(/^\/+/, ""))
		const zombieImage = yield* fs.readFile(zombieImagePath)
		const siteLogo = yield* fs.readFile(path.join(process.cwd(), "public", "logo.webp"))

		const mapBackdropSrc = `${debutMap.id}-map-backdrop`
		const mapBackdropData = yield* fs.readFile(
			path.join(process.cwd(), "public", debutMap.image.replace(/^\/+/, "")),
		)

		const titleLen = zombie.title.length
		const titlePx = titleLen > 26 ? 40 : titleLen > 20 ? 46 : titleLen > 14 ? 52 : 58

		const debutWhere = debutMap.title

		const weakStr = weakLabels.length ? weakLabels.join(" · ") : "—"
		const typeMetaColor = ZOMBIE_TYPE_OG_COLOR[zombie.type]

		const attacksOgBlock = (
			<>
				<span
					tw="text-lg font-bold uppercase tracking-[0.07em] shrink-0"
					style={{
						color: MUTED_FG,
						fontFamily: OG_FONT_MONO,
					}}
				>
					Attacks
				</span>
				<span
					tw="text-lg font-semibold leading-snug break-words min-w-0"
					style={{
						color: typeMetaColor,
						fontFamily: OG_FONT_MONO,
					}}
				>
					{attackStr}
				</span>
			</>
		)

		return yield* renderOg(
			<div
				tw="flex h-full w-full flex-col box-border overflow-hidden relative"
				style={{
					backgroundColor: Z_BG,
					fontFamily: "Geist Variable, system-ui, sans-serif",
					fontWeight: 600,
				}}
			>
				<>
					<img
						src={mapBackdropSrc}
						alt=""
						tw="absolute"
						style={{
							left: 0,
							top: 0,
							width: 1200,
							height: 630,
							objectFit: "cover",
							objectPosition: "center",
							filter: "blur(3px)",
							transform: "scale(1.02)",
							transformOrigin: "center center",
						}}
					/>
					<div
						tw="absolute"
						style={{
							left: 0,
							top: 0,
							width: 1200,
							height: 630,
							background: `linear-gradient(165deg, oklch(0.145 0 0 / 0.78) 0%, oklch(0.145 0 0 / 0.82) 45%, oklch(0.145 0 0 / 0.8) 100%)`,
						}}
					/>
				</>

				<div tw="relative z-10 flex flex-col flex-1 min-h-0 w-full h-full">
					<div tw="flex flex-row flex-1 min-h-0 w-full">
						<div
							tw="relative flex flex-col items-center justify-center shrink-0 h-full box-border"
							style={{
								width: OG_PORTRAIT_COL.w,
								backgroundColor: "transparent",
								paddingLeft: OG_PORTRAIT_COL.padL,
								paddingRight: OG_PORTRAIT_COL.padR,
							}}
						>
							<div
								tw="shrink-0 box-border"
								style={{
									position: "absolute",
									display: "flex",
									left: ogPortraitFrameLeftPx,
									top: OG_TYPE_OVERLAY_TOP_PX,
									minHeight: OG_LOGO_ROW_H_PX,
									alignItems: "center",
									maxWidth: OG_PORTRAIT_COL.frame,
								}}
							>
								<div tw="flex shrink-0 flex-row items-center min-w-0" style={{ gap: 10 }}>
									<span
										tw="text-lg font-semibold leading-tight"
										style={{
											color: MUTED_FG,
											letterSpacing: "0.07em",
										}}
									>
										BESTIARY
									</span>
									<span
										tw="shrink-0 text-lg leading-none"
										style={{ color: PRIMARY, fontWeight: 700 }}
										aria-hidden
									>
										•
									</span>
									<span
										tw="text-lg font-bold uppercase leading-tight"
										style={{
											color: ZOMBIE_TYPE_OG_COLOR[zombie.type],
											letterSpacing: "0.07em",
											textShadow: "0 1px 14px rgba(0, 0, 0, 0.55)",
										}}
									>
										{zombie.type}
									</span>
								</div>
							</div>
							<div
								tw="shrink-0 overflow-hidden box-border"
								style={{
									width: OG_PORTRAIT_COL.frame,
									height: 315,
									borderRadius: 28,
									backgroundColor: CARD_SURFACE,
									boxShadow: `0 16px 44px rgba(0, 0, 0, 0.45), 0 0 0 1px ${BORDER}`,
								}}
							>
								<img
									src={`${zombie.id}-portrait`}
									alt=""
									tw="h-full w-full shrink-0"
									style={{
										objectFit: "cover",
										objectPosition: "top center",
									}}
								/>
							</div>
						</div>

						<div
							tw="flex flex-col flex-1 min-w-0 min-h-0 box-border"
							style={{ padding: "36px 44px 40px 48px" }}
						>
							<div tw="flex flex-row justify-end items-center shrink-0 mb-4 w-full min-w-0">
								<img
									src="site-logo"
									alt=""
									tw="h-11 w-auto max-w-[120px] object-contain opacity-90 shrink-0"
								/>
							</div>

							<h1
								tw="font-black uppercase leading-[0.92] tracking-tighter shrink-0"
								style={{
									color: FG,
									fontSize: titlePx,
									letterSpacing: "-0.04em",
								}}
							>
								{zombie.title}
							</h1>

							<p
								tw="text-lg font-semibold uppercase tracking-[0.07em] mt-1 shrink-0 flex flex-row flex-wrap"
								style={{
									fontFamily: OG_FONT_MONO,
								}}
							>
								<span style={{ color: MUTED_FG }}>First appearance · </span>
								<span tw="font-bold" style={{ color: PRIMARY }}>
									{debutWhere}
								</span>
							</p>

							<p
								tw="text-xl font-semibold leading-snug mt-2 shrink-0"
								style={{ color: FG, opacity: 0.92, maxWidth: 720 }}
							>
								{clampText(zombie.description, 300)}
							</p>

							<div
								tw="flex flex-row shrink-0 mt-5 min-w-0 w-full items-stretch"
								style={{
									maxWidth: 720,
									paddingTop: 18,
									borderTop: `1px solid ${BORDER}`,
									gap: 0,
								}}
							>
								{attacksOnlyStat ? (
									<div tw="flex flex-col gap-1 min-w-0 w-full box-border">{attacksOgBlock}</div>
								) : (
									<>
										<div tw="flex flex-col gap-1 flex-1 min-w-0 pr-6 box-border">
											{hasWeakPoints ? (
												<>
													<span
														tw="text-lg font-bold uppercase tracking-[0.07em] shrink-0"
														style={{
															color: MUTED_FG,
															fontFamily: OG_FONT_MONO,
														}}
													>
														Weak points
													</span>
													<span
														tw="text-lg font-semibold leading-snug break-words min-w-0"
														style={{
															color: typeMetaColor,
															fontFamily: OG_FONT_MONO,
														}}
													>
														{weakStr}
													</span>
												</>
											) : (
												attacksOgBlock
											)}
										</div>
										<div
											tw="flex flex-col gap-1 flex-1 min-w-0 pl-6 box-border"
											style={{ borderLeft: `1px solid ${BORDER}` }}
										>
											{hasElemental ? (
												<>
													<span
														tw="text-lg font-bold uppercase tracking-[0.07em] shrink-0"
														style={{
															color: MUTED_FG,
															fontFamily: OG_FONT_MONO,
														}}
													>
														Elemental weaknesses
													</span>
													<div
														tw="flex flex-row flex-wrap items-center min-w-0 shrink-0"
														style={{ gap: 10 }}
													>
														{elementalModsOrdered.map((mod, i) =>
															mod ? (
																<img
																	key={`${mod.id}-${i}`}
																	src={mod.id}
																	alt=""
																	tw="shrink-0 object-contain"
																	style={{
																		width: OG_AMMO_ICON_PX,
																		height: OG_AMMO_ICON_PX,
																	}}
																/>
															) : (
																<span
																	key={`missing-${i}`}
																	tw="text-lg font-semibold leading-snug"
																	style={{
																		color: typeMetaColor,
																		fontFamily: OG_FONT_MONO,
																	}}
																>
																	—
																</span>
															),
														)}
													</div>
												</>
											) : (
												attacksOgBlock
											)}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>,
			{
				format: "jpeg",
				...OG_IMAGE_SIZE,
				stylesheets: ogStylesheets,
				persistentImages: [
					{ data: zombieImage, src: `${zombie.id}-portrait` },
					{ data: siteLogo, src: "site-logo" },
					{ data: mapBackdropData, src: mapBackdropSrc },
					...ammoPersistentImages,
				],
			},
		)
	},
	self => Effect.withLogSpan(self, "generateZombieImage"),
)

export const generateRelicImage = Effect.fnUntraced(
	function* (relic: Relic) {
		if (relic.state.valueOrUndefined === "Coming Soon") {
			return yield* new ImageGenerationError({ cause: new Error("Relic is Coming Soon") })
		}

		const fs = yield* FileSystem.FileSystem
		const path = yield* Path.Path
		const map = yield* getMapByKey(relic.map).pipe(Effect.fromOption)
		const relicImagePath = path.join(process.cwd(), "public", relic.image.replace(/^\/+/, ""))
		const relicImage = yield* fs.readFile(relicImagePath)
		const siteLogo = yield* fs.readFile(path.join(process.cwd(), "public", "logo.webp"))

		const mapBackdropSrc = `${map.id}-map-backdrop`
		const mapBackdropData = yield* fs.readFile(
			path.join(process.cwd(), "public", map.image.replace(/^\/+/, "")),
		)

		const titleLen = relic.title.length
		const titlePx = titleLen > 26 ? 40 : titleLen > 20 ? 46 : titleLen > 14 ? 52 : 58

		const mapTitle = map.title
		const estTime = formatEstimatedTimeRange(relic.estimatedTimeMins)
		const discoveredStr = new Date(relic.discoveredDate).toLocaleDateString("en-US", DATE_OPTIONS)

		return yield* renderOg(
			<div
				tw="flex h-full w-full flex-col box-border overflow-hidden relative"
				style={{
					backgroundColor: Z_BG,
					fontFamily: "Geist Variable, system-ui, sans-serif",
					fontWeight: 600,
				}}
			>
				<>
					<img
						src={mapBackdropSrc}
						alt=""
						tw="absolute"
						style={{
							left: 0,
							top: 0,
							width: 1200,
							height: 630,
							objectFit: "cover",
							objectPosition: "center",
							filter: "blur(3px)",
							transform: "scale(1.02)",
							transformOrigin: "center center",
						}}
					/>
					<div
						tw="absolute"
						style={{
							left: 0,
							top: 0,
							width: 1200,
							height: 630,
							background: RELIC_OG_BACKDROP_OVERLAY,
						}}
					/>
				</>

				<div tw="relative z-10 flex flex-col flex-1 min-h-0 w-full h-full">
					<div tw="flex flex-row flex-1 min-h-0 w-full">
						<div
							tw="relative flex flex-col items-center justify-center shrink-0 h-full box-border"
							style={{
								width: OG_PORTRAIT_COL.w,
								backgroundColor: "transparent",
								paddingLeft: OG_PORTRAIT_COL.padL,
								paddingRight: OG_PORTRAIT_COL.padR,
							}}
						>
							<div
								tw="shrink-0 box-border"
								style={{
									position: "absolute",
									display: "flex",
									left: ogPortraitFrameLeftPx,
									top: OG_TYPE_OVERLAY_TOP_PX,
									minHeight: OG_LOGO_ROW_H_PX,
									alignItems: "center",
									maxWidth: OG_PORTRAIT_COL.frame,
								}}
							>
								<div tw="flex shrink-0 flex-row items-center min-w-0" style={{ gap: 10 }}>
									<span
										tw="text-lg font-semibold leading-tight"
										style={{
											color: MUTED_FG,
											letterSpacing: "0.07em",
										}}
									>
										RELICS
									</span>
									<span
										tw="shrink-0 text-lg leading-none"
										style={{ color: PRIMARY, fontWeight: 700 }}
										aria-hidden
									>
										•
									</span>
									<span
										tw="text-lg font-bold uppercase leading-tight"
										style={{
											color: RELIC_TYPE_OG_COLOR[relic.type],
											letterSpacing: "0.07em",
											textShadow: "0 1px 14px rgba(0, 0, 0, 0.55)",
										}}
									>
										{relic.type}
									</span>
								</div>
							</div>
							<img
								src={`${relic.id}-portrait`}
								alt=""
								tw="shrink-0"
								style={{
									width: OG_PORTRAIT_COL.frame,
									height: 315,
									objectFit: "contain",
									objectPosition: "center",
								}}
							/>
						</div>

						<div
							tw="flex flex-col flex-1 min-w-0 min-h-0 box-border"
							style={{ padding: "36px 44px 40px 48px" }}
						>
							<div tw="flex flex-row justify-end items-center shrink-0 mb-4 w-full min-w-0">
								<img
									src="site-logo"
									alt=""
									tw="h-11 w-auto max-w-[120px] object-contain opacity-90 shrink-0"
								/>
							</div>

							<h1
								tw="font-black uppercase leading-[0.92] tracking-tighter shrink-0"
								style={{
									color: FG,
									fontSize: titlePx,
									letterSpacing: "-0.04em",
								}}
							>
								{relic.title}
							</h1>

							<p
								tw="text-lg font-semibold uppercase tracking-[0.07em] mt-1 shrink-0 flex flex-row flex-wrap"
								style={{
									fontFamily: OG_FONT_MONO,
								}}
							>
								<span style={{ color: MUTED_FG }}>Map · </span>
								<span tw="font-bold" style={{ color: PRIMARY }}>
									{mapTitle}
								</span>
							</p>

							<p
								tw="text-xl font-semibold leading-snug mt-2 shrink-0"
								style={{ color: FG, opacity: 0.92, maxWidth: 720 }}
							>
								{clampText(relic.description, 300)}
							</p>

							<div
								tw="flex flex-row flex-wrap shrink-0 items-end gap-x-10 gap-y-4 w-full mt-4 min-w-0"
								style={{ maxWidth: 720, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}
							>
								{metaColumn("Est. completion", estTime)}
								{metaColumn("Discovered", discoveredStr)}
							</div>
						</div>
					</div>
				</div>
			</div>,
			{
				format: "jpeg",
				...OG_IMAGE_SIZE,
				stylesheets: ogStylesheets,
				persistentImages: [
					{ data: relicImage, src: `${relic.id}-portrait` },
					{ data: siteLogo, src: "site-logo" },
					{ data: mapBackdropData, src: mapBackdropSrc },
				],
			},
		)
	},
	self => Effect.withLogSpan(self, "generateRelicImage"),
)

/** Merges a new version entry, drops manifest keys with no matching image under `outputBase`, writes JSON. */
const updateManifest = Effect.fnUntraced(function* (
	outputBase: string,
	manifestPath: string,
	manifest: OpengraphManifest,
	contentDir: OpengraphKind,
	fileBaseName: string,
	version: number,
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path

	const merged: Record<OpengraphKind, Record<string, number>> = {
		"main-quests": { ...manifest["main-quests"] },
		"side-quests": { ...manifest["side-quests"] },
		zombies: { ...manifest.zombies },
		relics: { ...manifest.relics },
	}
	merged[contentDir] = { ...merged[contentDir], [fileBaseName]: version }

	const pruned: Record<OpengraphKind, Record<string, number>> = {
		"main-quests": {},
		"side-quests": {},
		zombies: {},
		relics: {},
	}
	const removedManifestKeys: Array<{ kind: OpengraphKind; slug: string }> = []

	for (const kind of OPENGRAPH_KINDS) {
		for (const [slug, fileVersion] of Object.entries(merged[kind])) {
			const ogPath = path.join(outputBase, kind, `opengraph-${slug}-v${fileVersion}.jpg`)
			if (yield* fs.exists(ogPath)) {
				pruned[kind][slug] = fileVersion
			} else {
				removedManifestKeys.push({ kind, slug })
			}
		}
	}

	if (removedManifestKeys.length > 0) {
		const listed = removedManifestKeys.map(({ kind, slug }) => `${kind}/${slug}`).join(", ")
		yield* Effect.log(
			`Removed orphaned opengraph manifest keys (image file missing under output directory): ${listed}`,
		)
	}

	const updatedManifest = new OpengraphManifest(pruned, { disableChecks: true })
	yield* fs.writeFileString(manifestPath, yield* encodeOpengraphManifest(updatedManifest))
})

export const writeOgFile = Effect.fnUntraced(function* (
	outputBase: string,
	contentDir: OpengraphKind,
	fileBaseName: string,
	bytes: Uint8Array,
	options?: { manifestPath?: string },
) {
	const fs = yield* FileSystem.FileSystem
	const path = yield* Path.Path
	const dir = path.join(outputBase, contentDir)
	const manifestPath =
		options?.manifestPath ??
		manifestPathFromEnv() ??
		path.join(process.cwd(), "src/data", "opengraph-manifest.json")

	const manifest = yield* fs
		.readFileString(manifestPath)
		.pipe(Effect.flatMap(decodeOpengraphManifest))
	const version = Option.match(Option.fromUndefinedOr(manifest[contentDir][fileBaseName]), {
		onNone: () => 1,
		onSome: previousVersion => previousVersion + 1,
	})

	const oldPath = path.join(dir, `opengraph-${fileBaseName}-v${version - 1}.jpg`)
	const outPath = path.join(dir, `opengraph-${fileBaseName}-v${version}.jpg`)

	yield* fs.makeDirectory(dir, { recursive: true })
	yield* fs.writeFile(outPath, bytes).pipe(Effect.tap(() => Effect.log(`Wrote ${outPath}`)))
	yield* updateManifest(outputBase, manifestPath, manifest, contentDir, fileBaseName, version)

	yield* Effect.filterOrElse(
		fs.exists(oldPath),
		exists => !exists,
		() => fs.remove(oldPath),
	)
})

const mapSlugFlag = Flag.optional(Flag.string("map")).pipe(
	Flag.withAlias("m"),
	Flag.withDescription(
		"Map slug: one main-quest OG image when used alone, or filter for --zombies / --quests / --relics (batch only).",
	),
)

const mapsFlag = Flag.boolean("maps").pipe(
	Flag.withDescription("Generate OG images for every map that has a main quest."),
)

const questFlag = Flag.optional(Flag.string("quest")).pipe(
	Flag.withAlias("q"),
	Flag.withDescription("Side quest slug for one OG image."),
)

const questsFlag = Flag.boolean("quests").pipe(
	Flag.withDescription(
		"Generate OG images for all side quests (optional --map / -m limits to that map).",
	),
)

const zombieFlag = Flag.optional(Flag.string("zombie")).pipe(
	Flag.withAlias("z"),
	Flag.withDescription("Zombie slug for one OG image."),
)

const zombiesFlag = Flag.boolean("zombies").pipe(
	Flag.withDescription(
		"Generate OG images for all zombies (optional --map / -m limits to zombies that were released on that map).",
	),
)

const relicFlag = Flag.optional(Flag.string("relic")).pipe(
	Flag.withAlias("r"),
	Flag.withDescription("Relic slug for one OG image."),
)

const relicsFlag = Flag.boolean("relics").pipe(
	Flag.withDescription(
		"Generate OG images for all relics (optional --map / -m limits to relics on that map).",
	),
)

const outputDirFlag = Flag.directory("output-dir").pipe(
	Flag.withDefault(DEFAULT_OUTPUT_BASE),
	Flag.withAlias("o"),
	Flag.withDescription(
		`Base output directory (default: ${DEFAULT_OUTPUT_BASE}). Images go to <dir>/<content-type>/<slug>.jpg`,
	),
)

export const generateOgCommand = Command.make(
	"generate-og-images",
	{
		mapFlag: mapSlugFlag,
		mapsFlag: mapsFlag,
		questFlag: questFlag,
		questsFlag: questsFlag,
		zombieFlag: zombieFlag,
		zombiesFlag: zombiesFlag,
		relicFlag: relicFlag,
		relicsFlag: relicsFlag,
		outputDirFlag: outputDirFlag,
	},
	({
		mapFlag,
		mapsFlag,
		questFlag,
		questsFlag,
		zombieFlag,
		zombiesFlag,
		relicFlag,
		relicsFlag,
		outputDirFlag,
	}) =>
		Effect.gen(function* () {
			const path = yield* Path.Path
			const outputBase = path.resolve(outputDirFlag)
			const manifestLock = yield* Semaphore.make(1)

			const zombieFamily = zombiesFlag || Option.isSome(zombieFlag)
			const questFamily = questsFlag || Option.isSome(questFlag)
			const relicFamily = relicsFlag || Option.isSome(relicFlag)
			const mainFamily =
				mapsFlag || (Option.isSome(mapFlag) && !zombieFamily && !questFamily && !relicFamily)

			const modeCount =
				(zombieFamily ? 1 : 0) +
				(questFamily ? 1 : 0) +
				(relicFamily ? 1 : 0) +
				(mainFamily ? 1 : 0)

			if (modeCount !== 1) {
				return yield* new OgCliError({
					message:
						"Specify exactly one target: --maps, --map <id>, --quests [--map <id>], --quest <id>, --zombies [--map <id>], --zombie <id>, --relics [--map <id>], or --relic <id>.",
				})
			}

			if (zombieFamily) {
				if (zombiesFlag && Option.isSome(zombieFlag)) {
					return yield* new OgCliError({
						message: "Use either --zombies or --zombie <id>, not both.",
					})
				}
				if (Option.isSome(zombieFlag) && Option.isSome(mapFlag)) {
					return yield* new OgCliError({
						message: "--map is only valid with --zombies (batch), not with --zombie <id>.",
					})
				}

				if (Option.isSome(zombieFlag)) {
					const zombie = yield* getZombieByKey(zombieFlag.value as ZombieKey).pipe(
						Effect.fromOption,
					)
					const ogImage = yield* generateZombieImage(zombie)
					yield* writeOgFile(outputBase, "zombies", zombie.id, ogImage)
					return
				}

				const zombies = Option.match(mapFlag, {
					onNone: () => getZombies(),
					onSome: mapKey => getZombies().filter(z => Arr.head(z.maps).valueOrUndefined === mapKey),
				})
				if (!zombies.length) {
					return yield* new OgCliError({
						message: Option.match(mapFlag, {
							onNone: () => "No zombies found in the catalog.",
							onSome: mapKey => `No zombies found for map ${mapKey}`,
						}),
					})
				}

				yield* Effect.forEach(
					zombies,
					z =>
						Effect.gen(function* () {
							const ogImage = yield* generateZombieImage(z)
							yield* manifestLock.withPermits(1)(writeOgFile(outputBase, "zombies", z.id, ogImage))
						}),
					{ concurrency: 8 },
				)
				return
			}

			if (relicFamily) {
				if (relicsFlag && Option.isSome(relicFlag)) {
					return yield* new OgCliError({
						message: "Use either --relics or --relic <id>, not both.",
					})
				}
				if (Option.isSome(relicFlag) && Option.isSome(mapFlag)) {
					return yield* new OgCliError({
						message: "--map is only valid with --relics (batch), not with --relic <id>.",
					})
				}

				if (Option.isSome(relicFlag)) {
					const relic = yield* getRelicByKey(relicFlag.value as RelicKey).pipe(Effect.fromOption)
					if (Option.getOrUndefined(relic.state) === "Coming Soon") {
						return yield* new OgCliError({
							message: `Relic "${relicFlag.value}" is not available (Coming Soon).`,
						})
					}
					const ogImage = yield* generateRelicImage(relic)
					yield* writeOgFile(outputBase, "relics", relic.id, ogImage)
					return
				}

				const relics = Option.match(mapFlag, {
					onNone: () => getRelics(),
					onSome: mapKey => getRelics().filter(r => r.map === (mapKey as MapKey)),
				}).filter(r => Option.getOrUndefined(r.state) !== "Coming Soon")

				if (!relics.length) {
					return yield* new OgCliError({
						message: Option.match(mapFlag, {
							onNone: () => "No published relics found in the catalog.",
							onSome: mapKey => `No published relics found for map ${mapKey}`,
						}),
					})
				}

				yield* Effect.forEach(
					relics,
					r =>
						Effect.gen(function* () {
							const ogImage = yield* generateRelicImage(r)
							yield* manifestLock.withPermits(1)(writeOgFile(outputBase, "relics", r.id, ogImage))
						}),
					{ concurrency: 8 },
				)
				return
			}

			if (questFamily) {
				if (questsFlag && Option.isSome(questFlag)) {
					return yield* new OgCliError({
						message: "Use either --quests or --quest <id>, not both.",
					})
				}
				if (Option.isSome(questFlag) && Option.isSome(mapFlag)) {
					return yield* new OgCliError({
						message: "--map is only valid with --quests (batch), not with --quest <id>.",
					})
				}

				if (Option.isSome(questFlag)) {
					const questEntry = yield* getSideQuestByKey(questFlag.value as SideQuestKey).pipe(
						Effect.fromOption,
					)
					const ogImage = yield* generateSideQuestImage(questEntry)
					yield* writeOgFile(outputBase, "side-quests", questEntry.id, ogImage)
					return
				}

				const quests = Option.match(mapFlag, {
					onNone: () => getSideQuests(),
					onSome: mapKey => getSideQuests().filter(q => q.map === (mapKey as MapKey)),
				})
				if (!quests.length) {
					return yield* new OgCliError({
						message: Option.match(mapFlag, {
							onNone: () => "No side quests found in the catalog.",
							onSome: mapKey => `No side quests found for map ${mapKey}`,
						}),
					})
				}

				yield* Effect.forEach(
					quests,
					q =>
						Effect.gen(function* () {
							const ogImage = yield* generateSideQuestImage(q)
							yield* manifestLock.withPermits(1)(
								writeOgFile(outputBase, "side-quests", q.id, ogImage),
							)
						}),
					{ concurrency: 8 },
				)
				return
			}

			if (mapsFlag && Option.isSome(mapFlag)) {
				return yield* new OgCliError({
					message:
						"--maps already generates every main quest; omit --map or use --map <id> alone for one map.",
				})
			}

			if (mapsFlag) {
				const maps = getMapsWithMainQuest()
				if (!maps.length) {
					return yield* new OgCliError({
						message: "No maps with main quests found in the catalog.",
					})
				}

				yield* Effect.forEach(
					maps,
					m =>
						Effect.gen(function* () {
							const ogImage = yield* generateMainQuestImage(m)
							yield* manifestLock.withPermits(1)(
								writeOgFile(outputBase, "main-quests", m.id, ogImage),
							)
						}),
					{ concurrency: 8 },
				)
				return
			}

			if (Option.isSome(mapFlag)) {
				const map = yield* getMapByKey(mapFlag.value as MapKey).pipe(Effect.fromOption)
				const ogImage = yield* generateMainQuestImage(map)
				yield* writeOgFile(outputBase, "main-quests", map.id, ogImage)
				return
			}

			return yield* new OgCliError({
				message:
					"Specify --maps, --map <id>, --quests [--map <id>], --quest <id>, --zombies [--map <id>], --zombie <id>, --relics [--map <id>], or --relic <id>.",
			})
		}),
)

if (import.meta.main) {
	Command.run(generateOgCommand, {
		version: "1.0.0",
	}).pipe(Effect.withLogSpan("generate_og_images"), Effect.provide(BunServicesLayer), runMain)
}
