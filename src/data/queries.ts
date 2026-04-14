import type { ContentPaths } from "@/types/generated/content-paths.gen"
import { queryOptions } from "@tanstack/react-query"
import { getContent } from "@/data/server-functions/content"

/** Query options for fetching RSC content */
export const contentQueryOptions = (id: string, filePath: ContentPaths) =>
	queryOptions({
		queryKey: [id, filePath],
		structuralSharing: false,
		queryFn: () =>
			getContent({
				data: {
					filePath,
				},
			}),
		staleTime: Infinity,
	})
