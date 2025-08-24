import { createClient, type EntriesQueries, type EntrySkeletonType } from "contentful"
import { createClient as managementCreateClient } from "contentful-management"
import { Effect, Redacted } from "effect"
import { env } from "@/env"
import { EntryNotFoundError, GetEntriesError } from "@/types/errors"
import { IN_DEVELOPMENT } from "@/utils/constants"

export class CMS extends Effect.Service<CMS>()("CMS", {
	effect: Effect.gen(function* () {
		const host = IN_DEVELOPMENT ? "preview.contentful.com" : "cdn.contentful.com"
		const accessToken = IN_DEVELOPMENT
			? env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
			: env.CONTENTFUL_ACCESS_TOKEN

		const client = createClient({
			accessToken: Redacted.value(accessToken),
			space: Redacted.value(env.CONTENTFUL_SPACE_ID),
			host,
		})

		const managementClient = managementCreateClient(
			{ accessToken: Redacted.value(env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) },
			{
				type: "plain",
				defaults: { spaceId: Redacted.value(env.CONTENTFUL_SPACE_ID), environmentId: "master" },
			},
		)

		const getEntry = <T extends EntrySkeletonType>(id: string) =>
			Effect.tryPromise({
				try: () => client.getEntry<T>(id, { include: 1 }),
				catch: error =>
					new EntryNotFoundError({
						message: `Failed to get entry with id: ${id}`,
						cause: error,
					}),
			})

		const getEntries = <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>) =>
			Effect.tryPromise({
				try: () =>
					client.getEntries<T>({
						...searchParams,
						limit: 200,
						include: 1,
					}),
				catch: error =>
					new GetEntriesError({
						message: `Failed to get entries with params: ${JSON.stringify(searchParams)}`,
						cause: error,
					}),
			})

		const getManagementEntries = (
			contentType: "featuredMaps" | "gameCategory" | "sideQuests" | "zombies",
		) =>
			Effect.tryPromise({
				try: () =>
					managementClient.entry.getMany({ query: { content_type: contentType, limit: 200 } }),
				catch: error =>
					new GetEntriesError({
						message: `Failed to get management entries for ${contentType}`,
						cause: error,
					}),
			})

		return { getEntries, getManagementEntries, getEntry } as const
	}).pipe(Effect.withLogSpan("cms_default")),
}) {}
