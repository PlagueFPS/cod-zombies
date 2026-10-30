import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { layer as BunServicesLayer } from "@effect/platform-bun/BunServices"
import { Effect } from "effect"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { walkImageFiles } from "@/scripts/image-file-walk"

describe("walkImageFiles", () => {
	let root: string
	let images: string

	beforeEach(() => {
		root = mkdtempSync(join(tmpdir(), "codz-images-"))
		images = join(root, "public")

		for (const dir of ["nested/deep", ".hidden", "nested/.hidden", "directory.png"]) {
			mkdirSync(join(images, dir), { recursive: true })
		}

		for (const file of [
			"cover.JPG",
			"nested/photo.JpEg",
			"nested/deep/image.PNG",
			"art.avif",
			"cover-384.webp",
			"nested/photo-1200.WEBP",
			"nested/original.WeBp",
			".hidden.jpg",
			".hidden/image.png",
			"nested/.hidden/image.jpg",
			"notes.txt",
		]) {
			writeFileSync(join(images, file), "fixture")
		}

		mkdirSync(join(root, "external"))
		writeFileSync(join(root, "external", "outside.png"), "fixture")
		symlinkSync(join(root, "external"), join(images, "linked-directory"), "dir")
		symlinkSync(join(root, "external", "outside.png"), join(images, "linked-file.PNG"), "file")
	})

	afterEach(() => {
		rmSync(root, { recursive: true, force: true })
	})

	for (const format of ["relative", "web"] as const) {
		for (const includeVariants of [false, true]) {
			test(`${format} paths with includeVariants=${includeVariants} skip hidden names and linked directories`, async () => {
				const paths = await Effect.runPromise(
					walkImageFiles(images, { format, includeVariants }).pipe(
						Effect.provide(BunServicesLayer),
					),
				)

				const expected = [
					"art.avif",
					"cover.JPG",
					"linked-file.PNG",
					"nested/deep/image.PNG",
					"nested/original.WeBp",
					"nested/photo.JpEg",
					...(includeVariants ? ["cover-384.webp", "nested/photo-1200.WEBP"] : []),
				].map(file => (format === "web" ? `/${file}` : file))

				expect(paths.sort()).toEqual(expected.sort())
			})
		}
	}
})
