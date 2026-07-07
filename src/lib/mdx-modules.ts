import type { Heading } from "@/components/table-of-contents"
import type { ContentPaths } from "@/types/generated/content-paths.gen"
import type { MDXContent } from "mdx/types"

const mdxModules = import.meta.glob<{
	default: MDXContent
	headings: Heading[]
	timeToRead: number
}>("/src/content/**/*.mdx")

/** Dynamically imports a compiled MDX module for the given content path. */
export function loadMdxModule(contentPath: ContentPaths) {
	const key = `/src/content/${contentPath.replace(/^content\//, "")}.mdx`
	const load = mdxModules[key]
	if (!load) throw new Error(`Missing MDX module for ${contentPath}`)
	return load()
}
