import { String as Str, Predicate } from "effect"
import { files } from "@/data/last-modified.json" with { type: "json" }
import { DATE_OPTIONS } from "@/utils/constants"
import { nowDate, nowMillis } from "@/utils/system-time"

/** Gets the last updated date of a content file from the generated manifest. */
export function getLastModified(filePath: string) {
	const posixPath = Str.replace(/\\/g, "/")(filePath)
	const lastModifiedKey = `${Str.replace(/^content\//, "")(Str.replace(/^.*?\/content\//, "")(posixPath))}.mdx`
	// SAFETY: the generated manifest is a filename-to-metadata dictionary; missing keys are handled below.
	const fileData = files[lastModifiedKey as keyof typeof files]

	if (!(Predicate.isNotNullish(fileData) && Predicate.isTruthy(fileData))) {
		console.warn(`Missing last-modified data for file ${filePath}`)

		return {
			lastModified: nowMillis(),
			lastModifiedFormatted: nowDate().toLocaleDateString(undefined, DATE_OPTIONS),
		}
	}

	return {
		lastModified: fileData.lastModified,
		lastModifiedFormatted: fileData.lastModifiedFormatted,
	}
}
