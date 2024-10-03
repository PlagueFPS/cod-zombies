import type { Asset, Entry, UnresolvedLink } from "contentful";
import type { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import type { Heading } from "@/types/Heading";
import type { Document } from "@contentful/rich-text-types";
import { slugify } from "./functions";
import { getAllNewCategoryIds, getAllNewMapIds } from "@/data/kv";
import { managementClient } from "@/contentful/contentful-management";

export const resolveAsset = (asset: UnresolvedLink<"Asset"> | Asset<undefined, string>) => {
  if (asset && 'fields' in asset && asset.fields.file) return asset
}

export const resolveEntry = (entry: UnresolvedLink<"Entry"> | Entry<TypeGameCategorySkeleton, undefined, string>) => {
  if (entry && 'fields' in entry && entry.fields) return entry
}

export const extractHeadings = (body: Document) => {
  const headings: Heading[] = []

  body.content.forEach(node => {
    if (node.nodeType.includes('heading-')) {
      if (node.content[0].nodeType === 'text') {
        headings.push({
          type: node.nodeType,
          text: node.content[0].value,
          id: slugify(node.content[0].value)
        })
      }
    }
  })

  return headings
}

export const calculateSkip = (page: number, limit: number) => {
  return page <= 1 ? 0 : (limit * page) - limit
}

export const isFirstTimePublish = (createdAt: string, updatedAt: string) => {
  const createdAtDate = new Date(createdAt)
  const updatedAtDate = new Date(updatedAt)
  return createdAtDate.getTime() === updatedAtDate.getTime()
}

export const createFeaturedMapsDTO = async (featuredMaps: Entry<TypeFeaturedMapsSkeleton, undefined, string>[]) => {
  const { draftIds, changedIds } = await getDraftsOrChanged("featuredMaps")
  const newMapIds = await getAllNewMapIds()

  return featuredMaps.map(featuredMap => {
    const mapImage = resolveAsset(featuredMap.fields.image)
    const category = resolveEntry(featuredMap.fields.gameCategory)
    const isDraft = draftIds.has(featuredMap.sys.id)
    const isChanged = changedIds.has(featuredMap.sys.id)
    const isNew = newMapIds.has(featuredMap.sys.id)
    
    return {
      id: featuredMap.sys.id,
      updatedAt: featuredMap.sys.updatedAt,
      slug: featuredMap.fields.slug,
      title: featuredMap.fields.title,
      description: featuredMap.fields.description,
      body: featuredMap.fields.body,
      image: createImageDTO(mapImage),
      category: createMapCategoryDTO(category),
      isDraft: isDraft,
      isChanged: isChanged,
      isNew: isNew
    }
  })
}

export const createGameCategoryDTO = async (gameCategorys: Entry<TypeGameCategorySkeleton, undefined, string>[]) => {
  const { draftIds, changedIds } = await getDraftsOrChanged("gameCategory")
  const newCategoryIds = await getAllNewCategoryIds()

  return gameCategorys.map(gameCategory => {
    const categoryImage = resolveAsset(gameCategory.fields.image)
    const isDraft = draftIds.has(gameCategory.sys.id)
    const isChanged = changedIds.has(gameCategory.sys.id)
    const isNew = newCategoryIds.has(gameCategory.sys.id)

    return {
      ...gameCategory.fields,
      id: gameCategory.sys.id,
      image: createImageDTO(categoryImage),
      isDraft: isDraft,
      isChanged: isChanged,
      isNew: isNew
    }
  })
}

const createImageDTO = (image: Asset<undefined, string> | undefined) => {
  return {
    url: image?.fields.file?.url,
    width: image?.fields.file?.details?.image?.width,
    height: image?.fields.file?.details?.image?.height
  }
}

const createMapCategoryDTO = (category: Entry<TypeGameCategorySkeleton, undefined, string> | undefined) => {
  if (!category) throw new Error("Expected map to have a category")
  return {
    title: category.fields.title,
    slug: category.fields.slug
  }
}

const getDraftsOrChanged = async (contentType: "featuredMaps" | "gameCategory") => {
  const featuredMaps = await managementClient.entry.getMany({
    query: {
      content_type: contentType
    }
  })
  
  const draftIds = new Set<string>()
  const changedIds = new Set<string>()

  featuredMaps.items.forEach(map => {
    if (!map.sys.publishedVersion) {
      draftIds.add(map.sys.id)
    } else if (!!map.sys.publishedVersion && map.sys.version >= map.sys.publishedVersion + 2) {
      changedIds.add(map.sys.id)
    }
  })

  return {
    draftIds,
    changedIds
  }
}
