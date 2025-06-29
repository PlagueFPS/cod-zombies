import type { Asset, Entry, UnresolvedLink, EntrySkeletonType } from "contentful";
import type { 
  TypeFeaturedMapsSkeleton, 
  TypeGameCategorySkeleton, 
  TypeReferencedMapsSkeleton, 
  TypeZombieAttacksSkeleton, 
  ZombieItem 
} from "@/contentful/Types/contentful-types";
import type { Heading } from "@/components/TableOfContents/TableOfContents";
import type { Document } from "@contentful/rich-text-types";
import { slugify, TypeGuards } from "./functions";
import { youtube_url } from "@/components/RichText/RichLink/RichLink";

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
    } else if (node.content.some(node => node.nodeType === "hyperlink")) {
      node.content.forEach((node: any) => {
        if (node.nodeType === "hyperlink" && node.data.uri.startsWith(youtube_url)) {
          headings.push({
            type: 'heading-3',
            text: node.content[0].value,
            id: slugify(node.content[0].value)
          })
        }
      })
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

export const isFirstTimePublish = (createdAt: Date, updatedAt: Date) => {
  return createdAt.getTime() === updatedAt.getTime()
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

export const createZombieAttackDTO = (attack: Entry<TypeZombieAttacksSkeleton, undefined, string> | undefined) => {
  if (!attack) throw new Error("Expected zombie to have an attack")
  return {
    id: attack.sys.id,
    name: attack.fields.name,
    range: attack.fields.range,
    description: attack.fields.description
  }
}