import type { Heading } from "@/components/table-of-contents"
import type { Program } from "estree-jsx"
import type { Root } from "mdast"
import type { MdxjsEsm } from "mdast-util-mdxjs-esm"
import { parse } from "acorn"
import { toString } from "mdast-util-to-string"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import { unified } from "unified"
import { visit, SKIP } from "unist-util-visit"
/** Keep in sync with `slugify` in `@/utils/shared-functions` (used for heading anchor ids).
 * Not imported here: this file is loaded from `vite.config.ts` and cannot depend on modules that use the `@/` alias.
 */
const slugify = (text: string) =>
	text
		.toLowerCase()
		.trim()
		.replace(/&/g, "and")
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_]+/g, "-")
		.replace(/--+/g, "-")
		.replace(/^-+|-+$/g, "")

const WORDS_PER_MINUTE = 200

const countWords = (value: string) =>
	value
		.trim()
		.split(/\s+/)
		.filter(word => word.length > 0).length

/**
 * One pass to collect h2–h4 headings and reading time (word count) from a parsed MDX mdast.
 * Intentionally ignores fenced code blocks, ESM, and inline/flow JS expressions; counts `text` and
 * `inlineCode` and text inside MDX/JSX as plain words.
 */
export function collectMdxDocumentMeta(tree: Root): { headings: Heading[]; timeToRead: number } {
	const headings: Heading[] = []

	visit(tree, "heading", node => {
		if (node.depth < 2 || node.depth > 4) return
		const text = toString(node, { includeImageAlt: true }).trim()
		if (!text) return
		const type = node.depth === 2 ? "h2" : node.depth === 3 ? "h3" : "h4"
		headings.push({ type, text, id: slugify(text) })
	})

	let wordCount = 0
	visit(tree, node => {
		if (node.type === "code" || node.type === "mdxjsEsm") return SKIP
		if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
			return SKIP
		}
		if (node.type === "text" && "value" in node && typeof node.value === "string") {
			wordCount += countWords(node.value)
		} else if (node.type === "inlineCode" && "value" in node && typeof node.value === "string") {
			wordCount += countWords(node.value)
		}
	})

	const timeToRead = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
	return { headings, timeToRead }
}

function getLeadingEsmIndexAfter(tree: Root): number {
	const { children } = tree
	let i = 0
	for (; i < children.length; i++) {
		if (children[i]!.type !== "mdxjsEsm") break
	}
	return i
}

function buildMdxEsmNode(headings: Heading[], timeToRead: number): MdxjsEsm {
	const value = `export const headings = ${JSON.stringify(headings)};\nexport const timeToRead = ${timeToRead};\n`
	const estree = parse(value, { ecmaVersion: "latest", sourceType: "module" }) as Program
	return {
		type: "mdxjsEsm",
		value,
		data: { estree },
	}
}

/**
 * For scripts / tooling: parse a raw MDX file string the same way as the build, without invoking the full MDX compiler.
 */
export function getMdxDocumentMetaFromSource(source: string) {
	const tree = unified().use(remarkParse).use(remarkMdx).parse(source) as Root
	return collectMdxDocumentMeta(tree)
}

/**
 * Inserts `export const headings` / `export const timeToRead` at build time, after any leading
 * `import` / ESM at the top of the file.
 */
export function remarkMdxMeta() {
	return (tree: Root) => {
		const { headings, timeToRead } = collectMdxDocumentMeta(tree)
		const estreeNode = buildMdxEsmNode(headings, timeToRead)
		const insertAt = getLeadingEsmIndexAfter(tree)
		tree.children.splice(insertAt, 0, estreeNode)
	}
}
