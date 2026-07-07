import { compile } from "@mdx-js/mdx"
import { expect, it } from "vitest"
import { remarkMdxMeta } from "@/lib/remark-mdx-meta"

it("injects named exports for headings and time to read from MDX", async () => {
	const mdx = `## Hello

Some *words* to measure reading time.`

	const out = await compile(mdx, { remarkPlugins: [remarkMdxMeta] })
	const code = String(out)

	expect(code).toMatch(/export const headings/)
	expect(code).toMatch(/export const timeToRead/)
})
