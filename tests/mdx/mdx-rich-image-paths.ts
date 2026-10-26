import { statSync } from "node:fs"
import { isAbsolute, join, relative } from "node:path"
import { Array as Arr, String as Str, Predicate } from "effect"
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

	for (const tagMatch of Str.matchAll(RICH_IMAGE_TAG_RE)(content)) {
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
		if (!(Predicate.isNotNullish(ref.image) && Predicate.isTruthy(ref.image))) {
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
	return Arr.map(loadMdxCorpus(), file => ({ label: file.label, content: file.content }))
}

export function publicImageFileExists(imagePath: string, publicDir: string = PUBLIC_DIR): boolean {
	const absolutePath = resolvePublicImage(imagePath, publicDir)

	if (!(Predicate.isNotNullish(absolutePath) && Predicate.isTruthy(absolutePath))) return false

	try {
		return statSync(absolutePath).isFile()
	} catch {
		return false
	}
}

function resolvePublicImage(imagePath: string, publicDir: string): string | undefined {
	if (
		!Str.startsWith("/")(imagePath) ||
		Str.startsWith("//")(imagePath) ||
		Str.includes("\\")(imagePath) ||
		Str.includes("\0")(imagePath)
	) {
		return undefined
	}

	let decoded: string

	try {
		decoded = decodeURIComponent(imagePath)
	} catch {
		return undefined
	}

	if (!Str.startsWith("/")(decoded) || Str.startsWith("//")(decoded)) return undefined

	const absolutePath = join(publicDir, Str.slice(1)(decoded))
	const fromPublic = relative(publicDir, absolutePath)

	if (fromPublic === "" || Str.startsWith("..")(fromPublic) || isAbsolute(fromPublic))
		return undefined

	return absolutePath
}

function lineNumberAt(content: string, index: number): number {
	return Str.split(Str.slice(0, index)(content), "\n").length
}
