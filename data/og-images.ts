import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { LoadFontDataError } from "@/types/errors"

export const getFontData = async () => {
	try {
		const [geistSemiBold, geistBold] = await Promise.all([
			readFile(join(process.cwd(), "assets/Geist-SemiBold.otf")),
			readFile(join(process.cwd(), "assets/Geist-Bold.otf")),
		])

		return { geistSemiBold, geistBold }
	} catch (error) {
		console.error(new LoadFontDataError({ message: "Failed to load font data.", cause: error }))
		return null
	}
}
