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
		.replace(/^["'!]+|["'!]+$/g, "") // Remove leading/trailing quotes and exclamation points
		.replace(/[ ,'"]+/g, "-") // Removed period from this replacement
		.replace(/&/g, "and") // Replace ampersands with "and"
		.replace(/\./g, "") // Remove all periods
		.replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single one
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
