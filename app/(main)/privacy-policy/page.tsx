import type { Metadata } from "next"
import { Effect } from "effect"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import richStyles from "@/components/rich-text/rich-text.module.css"
import { cn } from "@/lib/utils"
import { useMDXComponents } from "@/mdx-components"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getLastUpdated } from "@/utils/functions"

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"Learn about how we collect, use, and protect your personal information. Our privacy policy outlines our commitment to safeguarding your data and privacy rights.",
	openGraph: {
		...GLOBAL_OG_PROPS.openGraph,
		title: "Privacy Policy",
		description:
			"Learn about how we collect, use, and protect your personal information. Our privacy policy outlines our commitment to safeguarding your data and privacy rights.",
		url: `/privacy-policy`,
	},
	twitter: {
		title: "Privacy Policy",
		description:
			"Learn about how we collect, use, and protect your personal information. Our privacy policy outlines our commitment to safeguarding your data and privacy rights.",
		card: "summary_large_image",
	},
}

export default async function PrivacyPolicy() {
	const mdxComponents = useMDXComponents()
	return await Effect.gen(function* () {
		const { default: MDXContent } = yield* Effect.tryPromise(
			() => import("@/content/legal/privacy-policy.mdx"),
		)
		const lastUpdated = yield* getLastUpdated("./content/legal/privacy-policy.mdx")

		return (
			<article className="flex w-full justify-center">
				<div className="mx-auto flex w-full max-w-(--desktop) flex-col items-center justify-start xl:mx-4">
					<div className="flex w-full grow flex-col-reverse justify-center xl:flex-row">
						<section className="flex w-full max-w-7xl flex-col items-center justify-center">
							<div className="relative mt-4 w-full xl:my-6">
								<div className="-top-10 absolute left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
									<Breadcrumbs links={[{ title: "Privacy Policy", href: `/privacy-policy` }]} />
								</div>
							</div>
							<div className="mb-4 flex w-full flex-col items-start justify-center border-b-2 px-4 pb-6 md:gap-4 md:px-8">
								<h2 className="dark:dark-text-gradient pb-2 font-extrabold text-4xl text-gradient md:text-5xl lg:text-6xl">
									Privacy Policy
								</h2>
								<span className="text-muted-foreground text-sm">Last Updated: {lastUpdated}</span>
							</div>
							<div className={cn("relative mx-auto max-w-[80ch] px-4", richStyles.body)}>
								<MDXContent components={mdxComponents} />
							</div>
						</section>
					</div>
				</div>
			</article>
		)
	}).pipe(
		Effect.withLogSpan("privacy_policy_page"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(_error => Effect.dieMessage("Failed to load MDX content")),
		Effect.ensureErrorType<never>(),
		Effect.runPromise,
	)
}
