import { beforeAll, describe, expect, test } from "vitest"
import {
	buildSiteRouteIndex,
	extractLinksFromMdx,
	findUnclosedMarkdownLinks,
	isInternalHref,
	loadMdxCorpus,
	resolveFragment,
	resolveInternalPath,
	splitHref,
	type MdxCorpusFile,
	type SiteRouteIndex,
} from "@/tests/mdx/mdx-link-validation"

let corpus: MdxCorpusFile[]
let routeIndex: SiteRouteIndex

beforeAll(async () => {
	corpus = loadMdxCorpus()
	const contentByPath = new Map(corpus.map(file => [file.contentPath, file.content]))
	routeIndex = await buildSiteRouteIndex(contentByPath)
})

describe("MDX link integrity", () => {
	test("markdown links are well-formed", () => {
		const malformed: string[] = []

		for (const file of corpus) {
			for (const issue of findUnclosedMarkdownLinks(file.content)) {
				malformed.push(`${file.label}:${issue.line} unclosed link: ${issue.excerpt}`)
			}
		}

		expect(malformed, malformed.join("\n")).toEqual([])
	})

	test("internal links resolve to site routes and heading anchors", () => {
		const failures: string[] = []

		for (const file of corpus) {
			for (const link of extractLinksFromMdx(file.content)) {
				if (!isInternalHref(link.href)) continue

				const { pathname, hash } = splitHref(link.href)

				if (pathname && !resolveInternalPath(pathname, routeIndex)) {
					failures.push(`${file.label}:${link.line} unknown internal path: ${pathname}`)
					continue
				}

				if (!resolveFragment(pathname, hash, routeIndex, file.contentPath)) {
					failures.push(`${file.label}:${link.line} unknown heading anchor: #${hash}`)
				}
			}
		}

		expect(failures, failures.join("\n")).toEqual([])
	})
})
