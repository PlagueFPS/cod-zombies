import type { Metadata } from "next"
import { Effect } from "effect"
import { Breadcrumbs } from "@/components/client/breadcrumbs"
import { LastUpdatedDisplay } from "@/components/client/last-updated-display"
// @ts-ignore: this is a valid import, tsc module resolution fails at compile time, but gives no errors in editor
import PrivacyPolicy from "@/content/legal/privacy-policy.mdx"
import { PageRuntime } from "@/lib/layers"
import { cn } from "@/lib/utils"
import { useMDXComponents } from "@/mdx-components"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getLastModified } from "@/utils/server-functions"
import richStyles from "@/app/rich-text.module.css"

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"Learn about how we collect, use, and protect your personal information. Our privacy policy outlines our commitment to safeguarding your data and privacy rights.",
	openGraph: {
		...GLOBAL_OG_PROPS,
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

export default async function PrivacyPolicyPage() {
	return await buildPrivacyPolicyPage().pipe(PageRuntime.runPromise)
}

const buildPrivacyPolicyPage = Effect.fn("buildPrivacyPolicyPage")(function* () {
	const mdxComponents = yield* Effect.sync(() => useMDXComponents())
	const { lastModified, lastModifiedFormatted } = yield* getLastModified("legal/privacy-policy.mdx")

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
								lastModified={lastModified}
								lastModifiedFormatted={lastModifiedFormatted}
								className="text-sm text-muted-foreground"
							/>
						</div>
						<div className={cn("relative mx-auto max-w-[80ch] px-4", richStyles.body)}>
							<PrivacyPolicy components={mdxComponents} />
						</div>
					</section>
				</div>
			</div>
		</article>
	)
})
