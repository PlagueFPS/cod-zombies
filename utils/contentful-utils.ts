import type { Asset, Entry, UnresolvedLink, EntrySkeletonType } from "contentful";
import type { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton, TypeReferencedMapsSkeleton } from "@/contentful/Types/contentful-types";
import type { ZombieItem } from "@/types/ZombieItem";
import type { Heading } from "@/types/Heading";
import type { Document } from "@contentful/rich-text-types";
import { slugify, TypeGuards } from "./functions";

export const resolveAsset = (asset: UnresolvedLink<"Asset"> | Asset<undefined, string>) => {
  if (asset && TypeGuards.hasProperty(asset, 'fields') && asset.fields.file) return asset
}

export const resolveEntry = <T extends EntrySkeletonType>(entry: UnresolvedLink<"Entry"> | Entry<T, undefined, string>) => {
  if (entry && TypeGuards.hasProperty(entry, 'fields') && entry.fields) return entry
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

export const formatTableCellData = (cellContent: unknown[]) => {
  const values: string[] = []
  const embeddedItems: ZombieItem[] = []
  let badgeItems: string[] =  []
  
  cellContent.forEach(content => {
    if (!TypeGuards.isObject(content) || !TypeGuards.hasProperty(content, 'nodeType')) return

    switch(content.nodeType) {
      default: // default in this case is "text"
        if (TypeGuards.hasProperty(content, 'value') && TypeGuards.isString(content.value)) {
          if (content.value.includes(',')) {
            const items = content.value.split(',').map(item => item.trim())
            badgeItems = [...badgeItems, ...items]
          } else {
            values.push(content.value)
          }
        }
        break
      case 'embedded-entry-inline':
        if (
          !TypeGuards.hasProperty(content, 'data') || 
          !TypeGuards.isObject(content.data) || 
          !TypeGuards.hasProperty(content.data, 'target')
        ) return
        
        // At this point we know it is a ZombieItem
        embeddedItems.push(content.data.target as ZombieItem)
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

  if (TypeGuards.hasProperty(item.fields, 'rarity')) {
    return {
      id: item.sys.id,
      title: item.fields.title,
      image: createImageDTO(itemImage),
      description: item.fields.description,
      rarity: item.fields.rarity,
      type: item.fields.type
    }
  }

  return {
    id: item.sys.id,
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

export const createQuestMapDTO = <T extends TypeReferencedMapsSkeleton | TypeFeaturedMapsSkeleton>(map: Entry<T, undefined, string> | undefined) => {
  if (!map) throw new Error("Expected quest to have a map")
  return {
    title: map.fields.title,
    slug: map.fields.slug
  }
}