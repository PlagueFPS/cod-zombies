import { getEntries } from "@/contentful/contentful";
import { TypeLegalSkeleton } from "@/contentful/Types/contentful-types";
import { CACHE_KEYS } from "@/utils/constants";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const getLegalDocuments = cache(unstable_cache(async (draftMode: boolean) => {
  const legalDocs = await INTERNAL_getLegalDocuments(draftMode)
  return legalDocs.map(doc => ({
    id: doc.sys.id,
    updatedAt: doc.sys.updatedAt,
    slug: doc.fields.slug,
  }))
}, [], {
  tags: [CACHE_KEYS.LEGAL.ALL]
}))

export const getLegalDocBySlug = cache(unstable_cache(async (draftMode: boolean, slug: string) => {
  const legalDocs = await INTERNAL_getLegalDocuments(draftMode)
  const doc = legalDocs.find(doc => doc.fields.slug === slug)
  if (!doc) return null

  return {
    id: doc.sys.id,
    updatedAt: doc.sys.updatedAt,
    title: doc.fields.title,
    slug: doc.fields.slug,
    content: doc.fields.content,
  }
}, [], {
  tags: [CACHE_KEYS.LEGAL.ALL]
}))

export const getLegalDocById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  const legalDocs = await INTERNAL_getLegalDocuments(draftMode)
  const doc = legalDocs.find(doc => doc.sys.id === id)
  if (!doc) return null

  return {
    id: doc.sys.id,
    slug: doc.fields.slug
  }
}, [], {
  tags: [CACHE_KEYS.LEGAL.ALL]
}))

const INTERNAL_getLegalDocuments = cache(async (draftMode: boolean) => {
  const { data, error } = await getEntries<TypeLegalSkeleton>({
    content_type: "legal",
    select: ["sys.id", "sys.updatedAt", "fields"],
  }, draftMode)

  if (error) {
    console.error(error)
    return []
  }

  return data.items
})