import { readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { String as Str } from "effect"
import { describe, expect, test } from "vitest"
import { getMdxDocumentMetaFromSource } from "@/lib/remark-mdx-meta"

const CONTENT_ROOT = join(process.cwd(), "src", "content")

function listMdxFiles(dir: string): string[] {
	const files: string[] = []

	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = join(dir, entry.name)

		if (entry.isDirectory()) {
			files.push(...listMdxFiles(fullPath))
		} else if (Str.endsWith(".mdx")(entry.name)) {
			files.push(fullPath)
		}
	}

	return files.sort()
}

describe("MDX heading formatting", () => {
	test("no MDX file has a collapsed heading mid-line or missing blank-line separation", () => {
		const issues: string[] = []

		for (const filePath of listMdxFiles(CONTENT_ROOT)) {
			const label = relative(process.cwd(), filePath)
			const lines = Str.split(readFileSync(filePath, "utf8"), /\r?\n/)
			let inCodeFence = false

			for (let index = 0; index < lines.length; index++) {
				const line = lines[index] ?? ""

				if (Str.startsWith("```")(Str.trimStart(line))) {
					inCodeFence = !inCodeFence
					continue
				}

				if (inCodeFence) continue

				if (/^#{1,6}\s/.test(line)) {
					const prev = lines[index - 1]
					const next = lines[index + 1]

					if (prev !== undefined && Str.trim(prev) !== "") {
						issues.push(`${label}:${index + 1} heading is missing a blank line above`)
					}

					if (next !== undefined && Str.trim(next) !== "") {
						issues.push(`${label}:${index + 1} heading is missing a blank line below`)
					}
				} else if (/\S\s+#{2,6}\s/.test(line)) {
					issues.push(`${label}:${index + 1} has a heading collapsed onto a non-empty line`)
				}
			}
		}

		expect(issues).toEqual([])
	})

	test("shattered-veil.mdx and maxis-potential.mdx expose the restored headings", () => {
		const shatteredVeil = readFileSync(
			join(CONTENT_ROOT, "main-quests", "shattered-veil.mdx"),
			"utf8",
		)

		const maxisPotential = readFileSync(
			join(CONTENT_ROOT, "main-quests", "maxis-potential.mdx"),
			"utf8",
		)

		expect(getMdxDocumentMetaFromSource(shatteredVeil).headings).toContainEqual({
			type: "h3",
			text: "Ray Gun MKII-Wraith Fire",
			id: "ray-gun-mkii-wraith-fire",
		})
		expect(getMdxDocumentMetaFromSource(maxisPotential).headings).toContainEqual({
			type: "h2",
			text: "Step 1: Extract the Truth",
			id: "step-1-extract-the-truth",
		})
	})
})
