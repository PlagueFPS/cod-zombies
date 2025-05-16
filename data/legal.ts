import { getEntries } from "@/contentful/contentful";
import { TypeLegalSkeleton } from "@/contentful/Types/contentful-types";
import { NEW_ENTRY_KV } from "@/lib/redis";
import { CACHE_KEYS } from "@/utils/constants";
import { tryCatch } from "@/utils/functions";
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

export const storeNewLegalDocId = async (id: string, createdAt: string) => {
  return await tryCatch(NEW_ENTRY_KV.set(id, createdAt, "Published", "legal"))
}

export const getLegalDocStatus = async (legalId: string) => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.get(legalId))

  if (error) {
    console.error(error)
    return { status: null }
  }

  if (!data) {
    console.warn("No data found for legal doc ID: ", legalId)
    return { status: null }
  }

  return { status: data.status }
}

export const updateLegalDocStatus = async (legalId: string, updatedAt: string) => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.get(legalId))
  if (error) {
    console.error(error)
    return { error }
  }
  
  if (!data) {
    console.warn("No data found for legal doc ID: ", legalId)
    return { error: null }
  }
  
  const { error: updateError } = await tryCatch(NEW_ENTRY_KV.set(legalId, updatedAt, "Published", "legal"))
  if (updateError) {
    console.error(updateError)
    return { error: updateError }
  }

  return { error: null }
}

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