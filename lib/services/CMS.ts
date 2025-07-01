import { createClient, type EntriesQueries, type EntrySkeletonType } from "contentful"
import { createClient as managementCreateClient } from "contentful-management"
import { Effect, Redacted } from "effect"
import { env } from "@/env"
import { GetEntriesError } from "@/types/errors"
import { IN_DEVELOPMENT } from "@/utils/constants"

export class CMS extends Effect.Service<CMS>()("CMS", {
	effect: (draftMode: boolean) =>
		Effect.gen(function* () {
			const space = Redacted.make(env.CONTENTFUL_SPACE_ID)
			const host = draftMode || IN_DEVELOPMENT ? "preview.contentful.com" : "cdn.contentful.com"
			const accessToken =
				draftMode || IN_DEVELOPMENT
					? Redacted.make(env.CONTENTFUL_PREVIEW_ACCESS_TOKEN)
					: Redacted.make(env.CONTENTFUL_ACCESS_TOKEN)

			const client = createClient({
				accessToken: Redacted.value(accessToken),
				space: Redacted.value(space),
				host,
			})

			const getEntries = <T extends EntrySkeletonType>(searchParams: EntriesQueries<T, undefined>) =>
				Effect.tryPromise({
					try: () => client.getEntries<T>(searchParams),
					catch: error => new GetEntriesError({ cause: error }),
				})

			return { getEntries } as const
		}).pipe(Effect.withLogSpan("cms_default")),
}) {}

export class CMSManagement extends Effect.Service<CMSManagement>()("CMSManagement", {
	effect: Effect.sync(() => {
		const spaceId = Redacted.make(env.CONTENTFUL_SPACE_ID)
		const accessToken = Redacted.make(env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN)

		const client = managementCreateClient(
			{
				accessToken: Redacted.value(accessToken),
			},
			{ type: "plain", defaults: { spaceId: Redacted.value(spaceId), environmentId: "master" } },
		)

		return { client } as const
	}).pipe(Effect.withLogSpan("cms_management_default")),
}) {}
