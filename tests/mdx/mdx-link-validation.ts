import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { Option } from "effect"
import { getGames } from "@/data/games"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMapByKey, getMapsWithMainQuest } from "@/data/maps"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { getMdxDocumentMetaFromSource } from "@/lib/remark-mdx-meta"

const CONTENT_DIR = join(process.cwd(), "src/content")
const MAIN_QUEST_GAME_PATTERN =
	/^\/(black-ops-1|black-ops-2|black-ops-3|black-ops-4|black-ops-cold-war|black-ops-6|black-ops-7)\/([^/?#]+)$/

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
	if (cachedMdxFiles) return cachedMdxFiles

	const files: string[] = []
	const walk = (dir: string) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, entry.name)
			if (entry.isDirectory()) walk(path)
			else if (entry.name.endsWith(".mdx")) files.push(path)
		}
	}
	walk(CONTENT_DIR)
	cachedMdxFiles = files.sort()
	return cachedMdxFiles
}

export function loadMdxCorpus(): MdxCorpusFile[] {
	return listMdxContentFiles().map(absolutePath => {
		const relativePath = absolutePath.slice(process.cwd().length + 1)
		const contentPath = relativePath.replace(/^src\/content\//, "content/").replace(/\.mdx$/, "")
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
		for (const match of content.matchAll(re)) {
			const href = match[group]
			const index = match.index
			if (!href || index == null) continue
			links.push({ href, line: lineNumberAt(content, index) })
		}
	}

	return links
}

export function findUnclosedMarkdownLinks(content: string): { line: number; excerpt: string }[] {
	const issues: { line: number; excerpt: string }[] = []
	for (const match of content.matchAll(UNCLOSED_MARKDOWN_LINK_RE)) {
		const index = match.index
		if (index == null) continue
		issues.push({ line: lineNumberAt(content, index), excerpt: match[0].trim() })
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
		if (!headingIds) {
			const absolutePath = join(CONTENT_DIR, contentPath.replace(/^content\//, "") + ".mdx")
			const { headings } = getMdxDocumentMetaFromSource(readFileSync(absolutePath, "utf8"))
			headingIds = new Set(headings.map(h => h.id))
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

export function splitHref(href: string): { pathname: string; hash: string } {
	if (href.startsWith("#")) return { pathname: "", hash: href.slice(1) }

	const hashIndex = href.indexOf("#")
	const pathAndQuery = hashIndex === -1 ? href : href.slice(0, hashIndex)
	const hash = hashIndex === -1 ? "" : href.slice(hashIndex + 1)
	const queryIndex = pathAndQuery.indexOf("?")
	const pathname = queryIndex === -1 ? pathAndQuery : pathAndQuery.slice(0, queryIndex)

	return { pathname, hash }
}

export function isInternalHref(href: string): boolean {
	return href.startsWith("/") || href.startsWith("#")
}

export function resolveInternalPath(pathname: string, index: SiteRouteIndex): boolean {
	if (pathname === "") return true
	const normalized = pathname.replace(/\/+$/, "") || "/"
	if (index.paths.has(normalized)) return true
	return MAIN_QUEST_GAME_PATTERN.test(normalized)
}

export function resolveFragment(
	pathname: string,
	hash: string,
	index: SiteRouteIndex,
	sourceContentPath?: string,
): boolean {
	if (!hash) return true

	if (pathname === "") {
		if (!sourceContentPath) return true
		const sourceRoutes = index.routesByContentPath.get(sourceContentPath) ?? []
		return sourceRoutes.some(route => index.headingsByPath.get(route)?.has(hash))
	}

	const targetPath = MAIN_QUEST_GAME_PATTERN.test(pathname)
		? pathname.replace(MAIN_QUEST_GAME_PATTERN, "/main-quests/$1/$2")
		: pathname
	return index.headingsByPath.get(targetPath)?.has(hash) ?? false
}

function lineNumberAt(content: string, index: number): number {
	return content.slice(0, index).split("\n").length
}
