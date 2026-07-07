import type { Heading } from "@/components/table-of-contents"
import type { ContentPaths } from "@/types/generated/content-paths.gen"
import type { MDXContent } from "mdx/types"
import { queryOptions } from "@tanstack/react-query"
import { loadMdxModule } from "@/lib/mdx-modules"
import { getLastModified } from "@/utils/content-meta"

export const MDX_META_QUERY_KEY = "mdx-meta" as const
export const MDX_COMPONENT_QUERY_KEY = "mdx-component" as const

export interface MdxMetaQueryData {
	headings: Heading[]
	timeToRead: number
	lastModified: number
	lastModifiedFormatted: string
}

export interface MdxComponentQueryData {
	Component: MDXContent
}

/** Query options for MDX metadata that can be dehydrated across SSR. */
export const mdxMetaQueryOptions = (id: string, filePath: ContentPaths) =>
	queryOptions({
		queryKey: [MDX_META_QUERY_KEY, id, filePath],
		queryFn: async (): Promise<MdxMetaQueryData> => {
			const { headings, timeToRead } = await loadMdxModule(filePath)
			return {
				headings,
				timeToRead,
				...getLastModified(filePath),
			}
		},
		structuralSharing: false,
		staleTime: Infinity,
	})

/** Query options for the compiled MDX component; excluded from SSR dehydration. */
export const mdxComponentQueryOptions = (id: string, filePath: ContentPaths) =>
	queryOptions({
		queryKey: [MDX_COMPONENT_QUERY_KEY, id, filePath],
		queryFn: async (): Promise<MdxComponentQueryData> => {
			const { default: Component } = await loadMdxModule(filePath)
			return { Component }
		},
		structuralSharing: false,
		staleTime: Infinity,
	})
