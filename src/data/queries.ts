import type { Heading } from "@/components/table-of-contents"
import type { ContentPaths } from "@/types/generated/content-paths.gen"
import type { MDXContent } from "mdx/types"
import { queryOptions } from "@tanstack/react-query"
import { loadMdxModule } from "@/lib/mdx-modules"
import { getLastModified } from "@/utils/content-meta"

export interface MdxQueryData {
	Component: MDXContent
	headings: Heading[]
	timeToRead: number
	lastModified: number
	lastModifiedFormatted: string
}

/** Query options for loading a compiled MDX module and its metadata. */
export const mdxQueryOptions = (id: string, filePath: ContentPaths) =>
	queryOptions({
		queryKey: [id, filePath],
		queryFn: async (): Promise<MdxQueryData> => {
			const { default: Component, headings, timeToRead } = await loadMdxModule(filePath)
			return {
				Component,
				headings,
				timeToRead,
				...getLastModified(filePath),
			}
		},
		structuralSharing: false,
		staleTime: Infinity,
	})
