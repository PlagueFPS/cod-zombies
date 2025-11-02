import type { MainQuestDifficulty } from "@/data/main-quests"
import type { ZombieType } from "@/data/zombies"

/**
 * Capitalizes the first letter of each word in a string, replacing hyphens and underscores with spaces.
 * @param text - The input string to be capitalized.
 * @example
 * capitalize("hello-world") // "Hello World"
 * capitalize("hello_world") // "Hello World"
 * capitalize("tom-and-jerry") // "Tom & Jerry"
 */
export const capitalize = (text: string) => {
	return text
		.replace(/[-_]/g, " ")
		.replace(/\band\b/g, "&")
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

/**
 * Converts a string to a URL-friendly slug, replacing spaces, slashes, and commas with hyphens, and '&' with 'and'.
 * @param text - The input string to be slugified.
 * @example
 * slugify("Hello World") // "hello-world"
 * slugify("Tom & Jerry") // "tom-and-jerry"
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

/**
 * Calculates the number of items to skip based on the current page and limit.
 * @param page - The current page number.
 * @param limit - The maximum number of items per page.
 * @returns The number of items to skip.
 */
export const calculateSkip = (page: number, limit: number) => {
	return page <= 1 ? 0 : limit * page - limit
}

/**
 * Sorts difficulties in ascending order.
 * @param a - The first difficulty.
 * @param b - The second difficulty.
 * @returns A negative number if a should come before b, a positive number if a should come after b, or 0 if they are equal.
 */
export const sortDifficulties = (a: MainQuestDifficulty, b: MainQuestDifficulty) => {
	const difficultyOrder: MainQuestDifficulty[] = ["Easy", "Medium", "Hard"]
	return difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b)
}

/**
 * Sorts release dates in descending order.
 * @param a - The first release date.
 * @param b - The second release date.
 * @returns A positive number if `a` is older than `b`, a negative number for the inverse, or 0 if they are equal
 */
export const sortReleaseDateDesc = (a: string | Date, b: string | Date) => {
	const dateA = new Date(a)
	const dateB = new Date(b)
	return dateB.getTime() - dateA.getTime()
}

/**
 * Sorts zombie types in ascending order.
 * @param a - The first zombie type.
 * @param b - The second zombie type.
 * @returns A negative number if a should come before b, a positive number if a should come after b, or 0 if they are equal.
 */
export const sortZombieTypes = (a: ZombieType, b: ZombieType) => {
	const typeOrder: ZombieType[] = ["Normal", "Special", "Elite", "Boss"]
	return typeOrder.indexOf(a) - typeOrder.indexOf(b)
}
