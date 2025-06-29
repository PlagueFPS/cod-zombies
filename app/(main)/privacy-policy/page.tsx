import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import RichTextRenderer from "@/components/rich-text/rich-text-renderer/rich-text-renderer"
import { getLegalDocBySlug } from "@/data/legal"
import { DATE_OPTIONS, GLOBAL_OG_PROPS } from "@/utils/constants"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"

export const generateMetadata = async (): Promise<Metadata> => {
  const { isEnabled } = await draftMode()
  const policy = await getLegalDocBySlug(isEnabled, "privacy-policy")
  if (!policy) notFound()
  const title = policy.title
  const description ='Learn about how we collect, use, and protect your personal information. Our privacy policy outlines our commitment to safeguarding your data and privacy rights.'

  return {
    title,
    description,
    openGraph: {
      ...GLOBAL_OG_PROPS.openGraph,
      title,
      description,
      url: `/${policy.slug}`
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    }
  } 
}


export default async function PrivacyPolicy() {
  const { isEnabled } = await draftMode()
  const policy = await getLegalDocBySlug(isEnabled, "privacy-policy")
  if (!policy) notFound()

  return (
    <article className="flex justify-center w-full">
      <div className="flex flex-col justify-start items-center max-w-(--desktop) mx-auto xl:mx-4 w-full">
        <div className="flex flex-col-reverse xl:flex-row grow w-full justify-center">
          <section className="flex flex-col items-center justify-center w-full max-w-7xl">
            <div className="relative w-full mt-4 xl:my-6">
              <div className="absolute -top-10 left-0 z-30 pl-4 xl:pl-0 flex w-full justify-center">
                <Breadcrumbs links={[
                  { title: policy.title, href: `/${policy.slug}` }
                ]} />
              </div>
            </div>
            <div className="flex flex-col justify-center items-start md:gap-4 px-4 pb-6 mb-4 md:px-8 w-full border-b-2">
              <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-gradient dark:dark-text-gradient pb-2">
                { policy.title }
              </h2>
              <span className="text-muted-foreground text-sm">Last Updated: { new Date(policy.updatedAt).toLocaleDateString(undefined, DATE_OPTIONS) }</span>
            </div>
            <RichTextRenderer slug={ policy.slug } body={ policy.content } />
          </section>
        </div>
      </div>
    </article>
  )
}
