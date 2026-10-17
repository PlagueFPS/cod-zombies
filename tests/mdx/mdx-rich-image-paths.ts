import { statSync } from "node:fs"
import { isAbsolute, join, relative } from "node:path"
import { loadMdxCorpus } from "@/tests/mdx/mdx-link-validation"

const PUBLIC_DIR = join(process.cwd(), "public")

const RICH_IMAGE_TAG_RE = /<RichImage\b([\s\S]*?)(?:\/>|>)/g

const STATIC_IMAGE_RE = /\bimage\s*=\s*(?:(["'])([^"']*)\1|\{\s*(["'])([^"']*)\3\s*\})/

export interface RichImageRef {
	readonly image: string | undefined
	readonly line: number
}

export interface RichImageSourceFile {
	readonly label: string
	readonly content: string
}

export function extractRichImageRefs(content: string): RichImageRef[] {
	const refs: RichImageRef[] = []

	for (const tagMatch of content.matchAll(RICH_IMAGE_TAG_RE)) {
		const attrs = tagMatch[1]
		const tagIndex = tagMatch.index

		if (attrs == null || tagIndex == null) continue

		const imageMatch = STATIC_IMAGE_RE.exec(attrs)
		const image = imageMatch?.[2] ?? imageMatch?.[4]

		refs.push({
			image: image === undefined || image.length === 0 ? undefined : image,
			line: lineNumberAt(content, tagIndex),
		})
	}

	return refs
}

export function missingRichImageMessages(
	label: string,
	content: string,
	publicDir: string = PUBLIC_DIR,
): string[] {
	const messages: string[] = []

	for (const ref of extractRichImageRefs(content)) {
		if (!ref.image) {
			messages.push(`${label}:${ref.line} <RichImage /> is missing a static image path`)
			continue
		}

		if (!publicImageFileExists(ref.image, publicDir)) {
			messages.push(
				`${label}:${ref.line} <RichImage image="${ref.image}" /> does not exist in public/`,
			)
		}
	}

	return messages
}

export function loadMdxRichImageSources(): RichImageSourceFile[] {
	return loadMdxCorpus().map(file => ({ label: file.label, content: file.content }))
}

export function publicImageFileExists(imagePath: string, publicDir: string = PUBLIC_DIR): boolean {
	const absolutePath = resolvePublicImage(imagePath, publicDir)

	if (!absolutePath) return false

	try {
		return statSync(absolutePath).isFile()
	} catch {
		return false
	}
}

function resolvePublicImage(imagePath: string, publicDir: string): string | undefined {
	if (
		!imagePath.startsWith("/") ||
		imagePath.startsWith("//") ||
		imagePath.includes("\\") ||
		imagePath.includes("\0")
	) {
		return undefined
	}

	let decoded: string

	try {
		decoded = decodeURIComponent(imagePath)
	} catch {
		return undefined
	}

	if (!decoded.startsWith("/") || decoded.startsWith("//")) return undefined

	const absolutePath = join(publicDir, decoded.slice(1))
	const fromPublic = relative(publicDir, absolutePath)

	if (fromPublic === "" || fromPublic.startsWith("..") || isAbsolute(fromPublic)) return undefined

	return absolutePath
}

function lineNumberAt(content: string, index: number): number {
	return content.slice(0, index).split("\n").length
}
