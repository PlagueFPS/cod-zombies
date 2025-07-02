import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import RichTextRenderer from "@/components/rich-text/rich-text-renderer/rich-text-renderer"
import { getLegalDocBySlug } from "@/data/legal"
import { DATE_OPTIONS, GLOBAL_OG_PROPS } from "@/utils/constants"

export const generateMetadata = async (): Promise<Metadata> => {
	const { isEnabled } = await draftMode()
	const policy = await getLegalDocBySlug(isEnabled, "privacy-policy")
	if (!policy) notFound()
	const title = policy.title
	const description =
		"Learn about how we collect, use, and protect your personal information. Our privacy policy outlines our commitment to safeguarding your data and privacy rights."

	return {
		title,
		description,
		openGraph: {
			...GLOBAL_OG_PROPS.openGraph,
			title,
			description,
			url: `/${policy.slug}`,
		},
		twitter: {
			title,
			description,
			card: "summary_large_image",
		},
	}
}

export default async function PrivacyPolicy() {
	const { isEnabled } = await draftMode()
	const policy = await getLegalDocBySlug(isEnabled, "privacy-policy")
	if (!policy) notFound()

	return (
		<article className="flex w-full justify-center">
			<div className="mx-auto flex w-full max-w-(--desktop) flex-col items-center justify-start xl:mx-4">
				<div className="flex w-full grow flex-col-reverse justify-center xl:flex-row">
					<section className="flex w-full max-w-7xl flex-col items-center justify-center">
						<div className="relative mt-4 w-full xl:my-6">
							<div className="-top-10 absolute left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
								<Breadcrumbs links={[{ title: policy.title, href: `/${policy.slug}` }]} />
							</div>
						</div>
						<div className="mb-4 flex w-full flex-col items-start justify-center border-b-2 px-4 pb-6 md:gap-4 md:px-8">
							<h2 className="dark:dark-text-gradient pb-2 font-extrabold text-4xl text-gradient md:text-5xl lg:text-6xl">
								{policy.title}
							</h2>
							<span className="text-muted-foreground text-sm">
								Last Updated: {new Date(policy.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS)}
							</span>
						</div>
						<RichTextRenderer slug={policy.slug} body={policy.content} />
					</section>
				</div>
			</div>
		</article>
	)
}
