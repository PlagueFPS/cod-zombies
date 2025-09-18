import type { Metadata } from 'next';
import { useMDXComponents } from "@/mdx-components"

export const generateMetadata = async (): Promise<Metadata> => {
  const { metadata } = await import("@/content/main-quests/ascension.mdx")

  return {
    title: `${metadata.map} Main Quest`,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      images: [metadata.image],
    },
  }
}

export default async function Page() {
  const { default: content, metadata } = await import("@/content/main-quests/ascension.mdx")
  return <div>{content({ components: useMDXComponents() })}</div>
}
  