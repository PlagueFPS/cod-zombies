import type { RelicType } from "@/data/relics"
import type { ZombieSpeed, ZombieType } from "@/data/zombies"
import { Option } from "effect"
import { MAIN_QUEST_DIFFICULTIES, type MainQuestDifficulty } from "@/data/maps"
import { SITE_TITLE } from "@/utils/constants"

/**
 * Gets the previous and next items adjacent to the given item ID.
 * This function assumes the array is sorted in descending order.
 * @param items - The array of items to search.
 * @param itemId - The ID of the item in the array to find adjacent items for.
 */
export const getAdjacentItems = <T extends { id: string }>(items: T[], itemId: string) => {
	const index = items.findIndex(item => item.id === itemId)
	if (index === -1) {
		return { prev: Option.none(), next: Option.none() }
	}
	const prevItem = items.at(index + 1)
	const nextItem = items.at(index - 1)
	let prev: Option.Option<T> = Option.none()
	let next: Option.Option<T> = Option.none()

	if (index < items.length - 1 && prevItem) {
		prev = Option.some(prevItem)
	}

	if (index > 0 && nextItem) {
		next = Option.some(nextItem)
	}

	return { prev, next }
}

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
 * Sorts difficulties in ascending order.
 * @param a - The first difficulty.
 * @param b - The second difficulty.
 * @returns A negative number if a should come before b, a positive number if a should come after b, or 0 if they are equal.
 */
export const sortDifficulties = (a: MainQuestDifficulty, b: MainQuestDifficulty) => {
	return MAIN_QUEST_DIFFICULTIES.indexOf(a) - MAIN_QUEST_DIFFICULTIES.indexOf(b)
}

/**
 * Sorts dates in ascending order.
 * @param a - The first date.
 * @param b - The second date.
 * @returns A positive number if `a` is older than `b`, a negative number for the inverse, or 0 if they are equal
 */
export const sortDates = (a: string | Date, b: string | Date) => {
	const dateA = new Date(a)
	const dateB = new Date(b)
	return dateA.getTime() - dateB.getTime()
}

/**
 * Returns the midpoint of an estimated time range (min/max in minutes) for sorting.
 * @param range - The time range with min and max in minutes.
 * @returns The midpoint in minutes.
 */
export const getEstimatedTimeMidpoint = (range: { min: number; max: number }) =>
	(range.min + range.max) / 2

/**
 * Sorts estimated time ranges in ascending order (shortest to longest) by midpoint.
 * @param a - The first time range.
 * @param b - The second time range.
 * @returns A positive number if a should come before b, a negative number if a should come after b, or 0 if they are equal.
 */
export const sortEstimatedTime = (
	a: { min: number; max: number },
	b: { min: number; max: number },
) => getEstimatedTimeMidpoint(a) - getEstimatedTimeMidpoint(b)

const formatMinutesForDisplay = (m: number) => {
	const mins = Math.round(m)
	if (mins < 60) return `${mins}m`
	const hours = Math.floor(mins / 60)
	const remainder = mins % 60
	return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`
}

/**
 * Formats a time range (min/max in minutes) for display, e.g. "45m", "1h 30m", "45m-1h 30m".
 * @param range - The time range with min and max in minutes.
 * @returns A formatted string for the time range.
 */
export const formatEstimatedTimeRange = (range: { min: number; max: number }) =>
	range.min === range.max
		? formatMinutesForDisplay(range.min)
		: `${formatMinutesForDisplay(range.min)}-${formatMinutesForDisplay(range.max)}`

/**
 * Formats the midpoint of a time range for display, e.g. "45m", "1h", "1h 20m".
 * @param range - The time range with min and max in minutes.
 * @returns A formatted string for the midpoint.
 */
export const formatEstimatedTimeMidpoint = (range: { min: number; max: number }) =>
	formatMinutesForDisplay(getEstimatedTimeMidpoint(range))

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

/**
 * Sorts relic types in ascending order.
 * @param a - The first relic type.
 * @param b - The second relic type.
 * @returns A negative number if a should come before b, a positive number if a should come after b, or 0 if they are equal.
 */
export const sortRelicTypes = (a: RelicType, b: RelicType) => {
	const typeOrder: RelicType[] = ["Grim", "Sinister", "Wicked"]
	return typeOrder.indexOf(a) - typeOrder.indexOf(b)
}

/**
 * Sorts zombie speeds in ascending order.
 * @param a - The first zombie speed.
 * @param b - The second zombie speed.
 * @returns A negative number if a should come before b, a positive number if a should come after b, or 0 if they are equal.
 */
export const sortZombieSpeeds = (a: ZombieSpeed, b: ZombieSpeed) => {
	const speedOrder: ZombieSpeed[] = ["Slow", "Medium", "Fast"]
	return speedOrder.indexOf(a) - speedOrder.indexOf(b)
}

/**
 * Compares two optional values using a comparison function.
 * @param a - The first optional value.
 * @param b - The second optional value.
 * @param compareFn - The comparison function.
 * @returns A negative number if a should come before b, a positive number if a should come after b, or 0 if they are equal.
 */
export const compareByOptionalSome = <T>(
	a: Option.Option<T>,
	b: Option.Option<T>,
	compareFn: (x: T, y: T) => number,
) => {
	if (Option.isSome(a) && Option.isSome(b)) {
		return compareFn(a.value, b.value)
	}
	if (Option.isSome(a)) return -1
	if (Option.isSome(b)) return 1
	return 0
}

/**
 * Transforms a string to PascalCase.
 * @param s - The string to transform.
 * @returns The transformed string.
 * @example
 * toPascalCase("hello world") // "HelloWorld"
 * toPascalCase("hello_world") // "HelloWorld"
 * toPascalCase("hello-world") // "HelloWorld"
 * toPascalCase("HELLO_WORLD") // "HelloWorld"
 */
export const toPascalCase = (s: string) =>
	s
		.toLowerCase()
		.split(/[^0-9a-zA-Z]+/)
		.filter(part => part.length > 0)
		.map(part => part[0]?.toUpperCase() + part.slice(1))
		.join("")

export const createSeoTitle = (title: string) => {
	return `${title} - ${SITE_TITLE}`
}
