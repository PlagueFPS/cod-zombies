/**
 * Capitalizes the first letter of each word in a string, replacing hyphens with spaces.
 * @param text - The input string to be capitalized.
 * @returns The capitalized string.
 * @example
 * capitalize("hello-world") // "Hello World"
 */
export const capitalize = (text: string) => {
	return text
		.replace(/-/g, " ")
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
		.replace(/[ /,]+/g, "-")
		.replace(/&/g, "and")
}

/**
 * Extracts the YouTube video ID from a given URL.
 * @param url - The YouTube video URL.
 * @returns The extracted video ID, or null if not found.
 */
export const getYouTubeVideoId = (url: string) => {
	const regex =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
	const match = url.match(regex)
	return match ? match[1] : null
}
