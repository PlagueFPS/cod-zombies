import type { Asset, Entry, UnresolvedLink, EntrySkeletonType } from "contentful";
import type { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import type { ZombieItem } from "@/types/ZombieItem";
import type { Heading } from "@/types/Heading";
import type { Document } from "@contentful/rich-text-types";
import { slugify } from "./functions";

export const resolveAsset = (asset: UnresolvedLink<"Asset"> | Asset<undefined, string>) => {
  if (asset && 'fields' in asset && asset.fields.file) return asset
}

export const resolveEntry = <T extends EntrySkeletonType>(entry: UnresolvedLink<"Entry"> | Entry<T, undefined, string>) => {
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

export const formatTableCellData = (cellContent: any[]) => {
  let values: string[] = []
  let listItems: string[] = []
  let embeddedItems: ZombieItem[] = []
  const badgeItems = listItems.join(',').split(',').map(item => item.trim())

  cellContent.forEach(content => {
    switch(content.nodeType) {
      default: // default in this case is "text"
        if (!content.value.includes(',')) values.push(content.value)
        else listItems.push(content.value)
        break
      case 'embedded-entry-inline':
        embeddedItems.push(content.data.target)
        break
    }
  })
  
  
  return {
    values,
    badgeItems,
    embeddedItems: embeddedItems.map(item => createItemTooltipDTO(item))
  }
}

export const calculateSkip = (page: number, limit: number) => {
  return page <= 1 ? 0 : (limit * page) - limit
}

export const isFirstTimePublish = (createdAt: string, updatedAt: string) => {
  const createdAtDate = new Date(createdAt)
  const updatedAtDate = new Date(updatedAt)
  return createdAtDate.getTime() === updatedAtDate.getTime()
}

export const createItemTooltipDTO = (item: ZombieItem) => {
  const itemImage = resolveAsset(item.fields.image)

  if ('rarity' in item.fields) {
    return {
      title: item.fields.title,
      image: createImageDTO(itemImage),
      description: item.fields.description,
      rarity: item.fields.rarity,
      type: item.fields.type
    }
  }

  return {
    title: item.fields.title,
    image: createImageDTO(itemImage),
    description: item.fields.description
  }
}

export const createImageDTO = (image: Asset<undefined, string> | undefined) => {
  return {
    url: image?.fields.file?.url,
    width: image?.fields.file?.details?.image?.width,
    height: image?.fields.file?.details?.image?.height
  }
}

export const createMapCategoryDTO = (category: Entry<TypeGameCategorySkeleton, undefined, string> | undefined) => {
  if (!category) throw new Error("Expected map to have a category")
  return {
    title: category.fields.title,
    slug: category.fields.slug
  }
}

export const createQuestMapDTO = (map: Entry<TypeFeaturedMapsSkeleton, undefined, string> | undefined) => {
  if (!map) throw new Error("Expected quest to have a map")
  return {
    title: map.fields.title,
    slug: map.fields.slug
  }
}
