import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { cn } from "cn"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { LastUpdatedDisplay } from "@/components/last-updated-display"
import { MdxContent } from "@/components/mdx-content"
import { Skeleton } from "@/components/ui/skeleton"
import { mdxComponentQueryOptions, mdxMetaQueryOptions } from "@/data/queries"
import { createSeoTitle } from "@/utils/shared-functions"
import richStyles from "@/rich-text.module.css"

const PRIVACY_POLICY_PATH = "content/legal/privacy-policy" as const

export const Route = createFileRoute("/privacy-policy")({
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.prefetchQuery(mdxMetaQueryOptions("privacy-policy", PRIVACY_POLICY_PATH)),
			context.queryClient.prefetchQuery(
				mdxComponentQueryOptions("privacy-policy", PRIVACY_POLICY_PATH),
			),
		])
		const title = createSeoTitle("Privacy Policy")
		const description =
			"Learn about how we collect, use, and protect your personal information. Our privacy policy outlines our commitment to safeguarding your data and privacy rights."

		return {
			serverUrl: context.serverUrl,
			title,
			description,
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{ title: loaderData?.title },
			{
				name: "description",
				content: loaderData?.description,
			},
			{
				property: "og:title",
				content: loaderData?.title,
			},
			{
				property: "og:description",
				content: loaderData?.description,
			},
			{
				property: "og:url",
				content: `${loaderData?.serverUrl}/privacy-policy`,
			},
			{
				property: "twitter:title",
				content: loaderData?.title,
			},
			{
				property: "twitter:description",
				content: loaderData?.description,
			},
		],
	}),
	pendingComponent: PrivacyPolicyPending,
	component: PrivacyPolicy,
	staleTime: Infinity,
})

function PrivacyPolicy() {
	const { data: meta } = useSuspenseQuery(
		mdxMetaQueryOptions("privacy-policy", PRIVACY_POLICY_PATH),
	)
	const { data: component } = useSuspenseQuery(
		mdxComponentQueryOptions("privacy-policy", PRIVACY_POLICY_PATH),
	)

	return (
		<article className="flex w-full justify-center">
			<div className="mx-auto flex w-full max-w-(--desktop) flex-col items-center justify-start xl:mx-4">
				<div className="flex w-full grow flex-col-reverse justify-center xl:flex-row">
					<section className="flex w-full max-w-7xl flex-col items-center justify-center">
						<div className="relative mt-4 w-full xl:my-6">
							<div className="absolute -top-10 left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
								<Breadcrumbs links={[{ title: "Privacy Policy", href: `/privacy-policy` }]} />
							</div>
						</div>
						<div className="mb-4 flex w-full flex-col items-start justify-center border-b-2 px-4 pb-6 md:gap-4 md:px-8">
							<h2 className="text-gradient pb-2 text-4xl font-extrabold md:text-5xl lg:text-6xl dark:dark-text-gradient">
								Privacy Policy
							</h2>
							<LastUpdatedDisplay
								lastModified={meta.lastModified}
								lastModifiedFormatted={meta.lastModifiedFormatted}
								className="text-sm text-muted-foreground"
							/>
						</div>
						<div className={cn("relative mx-auto max-w-[80ch] px-4", richStyles.body)}>
							<MdxContent Component={component.Component} />
						</div>
					</section>
				</div>
			</div>
		</article>
	)
}

function PrivacyPolicyPending() {
	return (
		<article className="flex w-full justify-center">
			<div className="mx-auto flex w-full max-w-(--desktop) flex-col items-center justify-start xl:mx-4">
				<div className="flex w-full grow flex-col-reverse justify-center xl:flex-row">
					<section className="flex w-full max-w-7xl flex-col items-center justify-center">
						<div className="relative mt-4 w-full xl:my-6">
							<div className="absolute -top-10 left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
								<Breadcrumbs links={[{ title: "Privacy Policy", href: `/privacy-policy` }]} />
							</div>
						</div>
						<div className="mb-4 flex w-full flex-col items-start justify-center border-b-2 px-4 pb-6 md:gap-4 md:px-8">
							<h2 className="text-gradient pb-2 text-4xl font-extrabold md:text-5xl lg:text-6xl dark:dark-text-gradient">
								Privacy Policy
							</h2>
							<span className="text-sm text-muted-foreground">
								Last Updated: {<Skeleton className="inline-block h-2.5 w-20" />}
							</span>
						</div>
						<Skeleton className="h-[150dvh] w-full max-w-[80ch] dark:bg-accent/50" />
					</section>
				</div>
			</div>
		</article>
	)
}
