import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { Option, Array as Arr, String as Str, Predicate } from "effect"
import { getGames } from "@/data/games"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMapByKey, getMapsWithMainQuest } from "@/data/maps"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { getMdxDocumentMetaFromSource } from "@/lib/remark-mdx-meta"

const CONTENT_DIR = join(process.cwd(), "src/content")

const MAIN_QUEST_GAME_PATTERN =
	/^\/(black-ops-1|black-ops-2|black-ops-3|infinite-warfare|wwii|black-ops-4|black-ops-cold-war|black-ops-6|black-ops-7)\/([^/?#]+)$/

const LINK_PATTERNS: readonly { re: RegExp; group: number }[] = [
	{ re: /\[([^\]]*)\]\(([^)]+)\)/g, group: 2 },
	{ re: /videoLink=["']([^"']+)["']/g, group: 1 },
]

const UNCLOSED_MARKDOWN_LINK_RE = /\[[^\]]+\]\([^)\n]+$/gm

export interface MdxLinkRef {
	readonly href: string
	readonly line: number
}

export interface MdxCorpusFile {
	readonly label: string
	readonly contentPath: string
	readonly content: string
}

export interface SiteRouteIndex {
	readonly paths: ReadonlySet<string>
	readonly headingsByPath: ReadonlyMap<string, ReadonlySet<string>>
	readonly routesByContentPath: ReadonlyMap<string, readonly string[]>
}

let cachedMdxFiles: string[] | undefined

export function listMdxContentFiles(): string[] {
	if (Predicate.isNotNullish(cachedMdxFiles) && Predicate.isTruthy(cachedMdxFiles))
		return cachedMdxFiles

	const files: string[] = []

	const walk = (dir: string) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, entry.name)

			if (entry.isDirectory()) walk(path)
			else if (Str.endsWith(".mdx")(entry.name)) files.push(path)
		}
	}

	walk(CONTENT_DIR)
	cachedMdxFiles = files.sort()

	return cachedMdxFiles
}

export function loadMdxCorpus(): MdxCorpusFile[] {
	return Arr.map(listMdxContentFiles(), absolutePath => {
		const relativePath = Str.slice(process.cwd().length + 1)(absolutePath)

		const contentPath = Str.replace(
			/\.mdx$/,
			"",
		)(Str.replace(/^src\/content\//, "content/")(relativePath))

		return {
			label: relativePath,
			contentPath,
			content: readFileSync(absolutePath, "utf8"),
		}
	})
}

export function extractLinksFromMdx(content: string): MdxLinkRef[] {
	const links: MdxLinkRef[] = []

	for (const { re, group } of LINK_PATTERNS) {
		for (const match of Str.matchAll(re)(content)) {
			const href = match[group]
			const index = match.index

			if (!(Predicate.isNotNullish(href) && Predicate.isTruthy(href)) || index == null) continue
			links.push({ href, line: lineNumberAt(content, index) })
		}
	}

	return links
}

export function findUnclosedMarkdownLinks(content: string): { line: number; excerpt: string }[] {
	const issues: { line: number; excerpt: string }[] = []

	for (const match of Str.matchAll(UNCLOSED_MARKDOWN_LINK_RE)(content)) {
		const index = match.index

		if (index == null) continue
		issues.push({ line: lineNumberAt(content, index), excerpt: Str.trim(match[0]) })
	}

	return issues
}

export async function buildSiteRouteIndex(): Promise<SiteRouteIndex> {
	const paths = new Set<string>([
		"/",
		"/maps",
		"/bestiary",
		"/main-quests",
		"/side-quests",
		"/relics",
		"/privacy-policy",
	])

	const headingsByPath = new Map<string, Set<string>>()
	const routesByContentPath = new Map<string, string[]>()
	const headingsByContentPath = new Map<string, Set<string>>()

	const registerHeadings = async (routePath: string, contentPath: string) => {
		let headingIds = headingsByContentPath.get(contentPath)

		if (Predicate.isNullish(headingIds)) {
			const absolutePath = join(CONTENT_DIR, Str.replace(/^content\//, "")(contentPath) + ".mdx")
			const { headings } = getMdxDocumentMetaFromSource(readFileSync(absolutePath, "utf8"))
			headingIds = new Set(Arr.map(headings, h => h.id))
			headingsByContentPath.set(contentPath, headingIds)
		}

		headingsByPath.set(routePath, headingIds)
		const routes = routesByContentPath.get(contentPath) ?? []

		if (!routes.includes(routePath)) routes.push(routePath)
		routesByContentPath.set(contentPath, routes)
	}

	for (const game of getGames()) {
		paths.add(`/${game.id}`)
	}

	for (const map of getMapsWithMainQuest()) {
		if (Option.isNone(map.mainQuest)) continue
		const contentPath = Option.getOrThrow(map.mainQuest)
		const mainQuestRoute = `/main-quests/${map.game}/${map.id}`
		const shortcutRoute = `/${map.game}/${map.id}`
		paths.add(mainQuestRoute)
		paths.add(shortcutRoute)
		await registerHeadings(mainQuestRoute, contentPath)
		await registerHeadings(shortcutRoute, contentPath)
	}

	for (const quest of getSideQuests()) {
		const map = Option.getOrThrow(getMapByKey(quest.map))
		const route = `/side-quests/${map.game}/${map.id}/${quest.id}`
		paths.add(route)
		await registerHeadings(route, quest.content)
	}

	for (const zombie of getZombies()) {
		const route = `/bestiary/${zombie.id}`
		paths.add(route)
		await registerHeadings(route, zombie.combatStrategy)
	}

	for (const relic of getRelics()) {
		const map = Option.getOrThrow(getMapByKey(relic.map))
		const route = `/relics/${map.game}/${relic.id}`
		paths.add(route)
		await registerHeadings(route, relic.content)
	}

	for (const map of getInteractiveMaps()) {
		paths.add(`/maps/${map.id}`)
	}

	return { paths, headingsByPath, routesByContentPath }
}

interface HrefParts {
	pathname: string
	hash: string
}

export function splitHref(href: string): HrefParts {
	if (Str.startsWith("#")(href)) return { pathname: "", hash: Str.slice(1)(href) }

	const hashIndex = Option.getOrElse(Str.indexOf("#")(href), () => -1)
	const pathAndQuery = hashIndex === -1 ? href : Str.slice(0, hashIndex)(href)
	const hash = hashIndex === -1 ? "" : Str.slice(hashIndex + 1)(href)
	const queryIndex = Option.getOrElse(Str.indexOf("?")(pathAndQuery), () => -1)
	const pathname = queryIndex === -1 ? pathAndQuery : Str.slice(0, queryIndex)(pathAndQuery)

	return { pathname, hash }
}

export function resolveInternalPath(pathname: string, index: SiteRouteIndex): boolean {
	if (pathname === "") return true
	const normalized = Str.replace(/\/+$/, "")(pathname) || "/"

	if (index.paths.has(normalized)) return true

	return MAIN_QUEST_GAME_PATTERN.test(normalized)
}

export function resolveFragment(
	pathname: string,
	hash: string,
	index: SiteRouteIndex,
	sourceContentPath?: string,
): boolean {
	if (!(Predicate.isNotNullish(hash) && Predicate.isTruthy(hash))) return true

	if (pathname === "") {
		if (Predicate.isNullish(sourceContentPath)) return true
		const sourceRoutes = index.routesByContentPath.get(sourceContentPath) ?? []

		return Arr.some(sourceRoutes, route => index.headingsByPath.get(route)?.has(hash) === true)
	}

	const targetPath = MAIN_QUEST_GAME_PATTERN.test(pathname)
		? Str.replace(MAIN_QUEST_GAME_PATTERN, "/main-quests/$1/$2")(pathname)
		: pathname

	return index.headingsByPath.get(targetPath)?.has(hash) ?? false
}

function lineNumberAt(content: string, index: number): number {
	return Str.split(Str.slice(0, index)(content), "\n").length
}
