import type { Heading } from "@/components/table-of-contents"
import type { ContentPaths } from "@/types/generated/content-paths.gen"
import type { MDXContent } from "mdx/types"
import { createServerFn } from "@tanstack/react-start"
import { renderServerComponent } from "@tanstack/react-start/rsc"
import { setResponseHeader } from "@tanstack/react-start/server"
import { MdxContent } from "@/components/mdx-content"
import { getLastModified, getOpengraphImageUrl } from "@/utils/functions.server"
import { StandardContentSchema, StandardOpengraphSchema } from "@/utils/validation-schemas"

const mdxModules = import.meta.glob<{
	default: MDXContent
	headings: Heading[]
	timeToRead: number
}>("/src/content/**/*.mdx")

const resolveMdxModule = (contentPath: ContentPaths) => {
	const relative = `${contentPath.replace(/^content\//, "")}.mdx`
	const key = Object.keys(mdxModules).find(k => k.endsWith(relative))
	if (!key) throw new Error(`Missing MDX module for ${contentPath}`)
	return { mdx: mdxModules[key]! }
}

/** Gets the MDX content for a given path, along with metadata such as headings and time to read. */
export const getContent = createServerFn()
	.validator((data: { filePath: ContentPaths }) => StandardContentSchema.make(data))
	.handler(async ({ data }) => {
		const { mdx } = resolveMdxModule(data.filePath as ContentPaths)
		const { default: Component, headings, timeToRead } = await mdx()
		const lastModified = getLastModified(data.filePath as ContentPaths)

		// Aggressively cache the response since it's static content
		// This can be removed once static server functions are stable
		// @see https://tanstack.com/start/latest/docs/framework/react/guide/static-server-functions
		setResponseHeader("Cache-Control", "public, max-age=31536000, immutable")

		const Content = await renderServerComponent(<MdxContent Component={Component} />)
		return {
			Content,
			headings,
			timeToRead,
			opengraphUrl: null,
			...lastModified,
		}
	})

/** Gets the current opengraph image URL version for a given kind and id. */
export const getOgImgUrl = createServerFn()
	.validator(StandardOpengraphSchema)
	.handler(async ({ data }) => {
		const url = await getOpengraphImageUrl(data.kind, data.id)

		// Aggressively cache the response since it's static content
		// This can be removed once static server functions are stable
		// @see https://tanstack.com/start/latest/docs/framework/react/guide/static-server-functions
		setResponseHeader("Cache-Control", "public, max-age=31536000, immutable")

		return url.valueOrUndefined
	})
