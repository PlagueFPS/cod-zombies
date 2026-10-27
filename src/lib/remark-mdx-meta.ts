import type { Heading } from "@/components/table-of-contents"
import type { Program } from "estree-jsx"
import type { Root } from "mdast"
import type { MdxjsEsm } from "mdast-util-mdxjs-esm"
import { parse } from "acorn"
import { Match, Predicate, String as Str, Array as Arr, pipe } from "effect"
import { toString } from "mdast-util-to-string"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import { unified } from "unified"
import { visit, SKIP } from "unist-util-visit"
/** Keep in sync with `slugify` in `@/utils/shared-functions` (used for heading anchor ids).
 * Not imported here: this file is loaded from `vite.config.ts` and cannot depend on modules that use the `@/` alias.
 */

const slugify = (text: string) =>
	pipe(
		text,
		Str.toLowerCase,
		Str.trim,
		Str.replace(/&/g, "and"),
		Str.replace(/[^\w\s-]/g, ""),
		Str.replace(/[\s_]+/g, "-"),
		Str.replace(/--+/g, "-"),
		Str.replace(/^-+|-+$/g, ""),
	)

const WORDS_PER_MINUTE = 200

const countWords = (value: string) =>
	pipe(
		value,
		Str.trim,
		Str.split(/\s+/),
		Arr.filter(word => word.length > 0),
	).length

interface MdxDocumentMeta {
	headings: Heading[]
	timeToRead: number
}

/**
 * One pass to collect h2–h4 headings and reading time (word count) from a parsed MDX mdast.
 * Intentionally ignores fenced code blocks, ESM, and inline/flow JS expressions; counts `text` and
 * `inlineCode` and text inside MDX/JSX as plain words.
 */
export function collectMdxDocumentMeta(tree: Root): MdxDocumentMeta {
	const headings: Heading[] = []

	visit(tree, "heading", node => {
		if (node.depth < 2 || node.depth > 4) return
		const text = Str.trim(toString(node, { includeImageAlt: true }))

		if (!(Predicate.isNotNullish(text) && Predicate.isTruthy(text))) return

		const type = Match.value(node.depth).pipe(
			Match.when(2, () => "h2" as const),
			Match.when(3, () => "h3" as const),
			Match.orElse(() => "h4" as const),
		)

		headings.push({ type, text, id: slugify(text) })
	})

	let wordCount = 0
	visit(tree, node => {
		if (node.type === "code" || node.type === "mdxjsEsm") return SKIP

		if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
			return SKIP
		}

		if (
			(node.type === "text" || node.type === "inlineCode") &&
			Predicate.hasProperty(node, "value") &&
			Predicate.isString(node.value)
		) {
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
	// SAFETY: acorn `sourceType: "module"` yields an ESTree Program for this generated ESM string.
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
	// SAFETY: remarkParse + remarkMdx produce an mdast Root for MDX source.
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
