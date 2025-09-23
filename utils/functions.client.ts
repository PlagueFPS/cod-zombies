import type { MainQuestDifficulty } from "@/data/main-quests"
import type { ZombieType } from "@/data/zombies"

/**
 * Capitalizes the first letter of each word in a string, replacing hyphens and underscores with spaces.
 * @param text - The input string to be capitalized.
 * @returns The capitalized string.
 * @example
 * capitalize("hello-world") // "Hello World"
 * capitalize("hello_world") // "Hello World"
 */
export const capitalize = (text: string) => {
	return text
		.replace(/[-_]/g, " ")
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

/**
 * Converts a string to a URL-friendly slug, replacing spaces, slashes, and commas with hyphens, and '&' with 'and'.
 * @param text - The input string to be slugified.
 * @returns The slugified string.
 * @example
 * slugify("Hello World") // "hello-world"
 */
export const slugify = (text: string) => {
	return text
		.toLowerCase()
		.trim()
		.replace(/&/g, "and") // Replace ampersands with "and" first
		.replace(/[^\w\s-]/g, "") // Remove all non-word characters except spaces and hyphens
		.replace(/[\s_]+/g, "-") // Replace spaces and underscores with a single hyphen
		.replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
		.replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

/**
 * Extracts the YouTube video ID from a given URL.
 * @param url - The YouTube video URL.
 * @returns The extracted video ID, or null if not found.
 * @example
 * getYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ") // "dQw4w9WgXcQ"
 * getYouTubeVideoId("https://youtube.com/shorts/dQw4w9WgXcQ") // "dQw4w9WgXcQ"
 */
export const getYouTubeVideoId = (url: string) => {
	const regex =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
	const match = url.match(regex)
	return match ? match[1] : null
}

export const calculateSkip = (page: number, limit: number) => {
	return page <= 1 ? 0 : limit * page - limit
}

/**
 * Normalizes a filename to always use the same format regardless of the original format.
 * @param filename - The input filename to be normalized.
 * @returns The normalized filename, with the extension lowercased.
 * @example
 * normalizeFilename("A.D.A.M.-unit.jpg") // "adam-unit.jpg"
 * normalizeFilename("A.D.-x.jpg") // "ad-x.jpg"
 * normalizeFilename("123.456.789.txt") // "123456789.txt"
 */
export const normalizeFilename = (filename: string) => {
	// take last path segment
	const parts = filename.split(/[\\/]/)
	const nameWithExt = parts[parts.length - 1]

	// split basename and extension (keep dot on ext)
	const lastDot = nameWithExt?.lastIndexOf(".")
	const basename = lastDot === -1 ? nameWithExt : nameWithExt?.slice(0, lastDot)
	const ext = lastDot === -1 ? "" : nameWithExt?.slice(lastDot).toLowerCase()

	// 1) Collapse dot-separated single-letter runs into a single token.
	//    Examples:
	//      "A.D.A.M.-unit" -> "ADAM-unit"
	//      "A.D.-x"        -> "AD-x"
	// This targets sequences of the form letter(.letter)+
	const preprocessed = basename?.replace(/([A-Za-z](?:\.[A-Za-z]){1,})/g, m => m.replace(/\./g, ""))

	// 2) Extract word/number tokens using Unicode-aware regex, then join with hyphen.
	const tokens = preprocessed?.normalize("NFC").match(/\p{L}+\p{N}*|\p{N}+/gu)

	const slug = tokens?.length
		? tokens.join("-").toLowerCase()
		: // fallback: remove unsafe chars, collapse hyphens
			preprocessed
				?.replace(/[^\p{L}\p{N}]+/gu, "-")
				.replace(/-+/g, "-")
				.replace(/^-|-$/g, "")
				.toLowerCase()

	return `${slug}${ext}`
}

export const fullyDecodeURIComponent = (encoded: string): string => {
	let decoded = encoded
	let lastDecoded: string
	do {
		lastDecoded = decoded
		try {
			decoded = decodeURIComponent(decoded)
		} catch (_e) {
			// If decoding fails, return the last successful decode
			return lastDecoded
		}
	} while (decoded !== lastDecoded)
	return decoded
}

export const sortDifficulties = (a: MainQuestDifficulty, b: MainQuestDifficulty) => {
	const difficultyOrder: MainQuestDifficulty[] = ["Easy", "Medium", "Hard"]
	return difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b)
}

export const sortReleaseDateDesc = (a: string | Date, b: string | Date) => {
	const dateA = new Date(a)
	const dateB = new Date(b)
	return dateB.getTime() - dateA.getTime()
}

export const sortZombieTypes = (a: ZombieType, b: ZombieType) => {
	const typeOrder: ZombieType[] = ["Normal", "Special", "Elite", "Boss"]
	return typeOrder.indexOf(a) - typeOrder.indexOf(b)
}
