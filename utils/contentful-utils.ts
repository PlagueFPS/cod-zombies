import type { Asset, Entry, UnresolvedLink, EntrySkeletonType } from "contentful";
import type { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton, TypeZombieItemsSkeleton } from "@/contentful/Types/contentful-types";
import type { Heading } from "@/types/Heading";
import type { Document } from "@contentful/rich-text-types";
import { slugify } from "./functions";
import { getAllNewMapIds, getDraftsOrChanged } from "@/data/featuredMaps";
import { getAllNewCategoryIds } from "@/data/gameCategory";
import { MAP_ORDER } from "./constants";

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

export const sortMaps = (map: Entry<TypeFeaturedMapsSkeleton, undefined, string>, map2: Entry<TypeFeaturedMapsSkeleton, undefined, string>) => {
  let a = MAP_ORDER[map.fields.slug]
  let b = MAP_ORDER[map2.fields.slug]
  return a === b ? 0 : a > b ? -1 : 1
}

export const formatTableCellData = (cellContent: any[]) => {
  let values: string[] = []
  let listItems: string[] = []
  let embeddedItems: Entry<TypeZombieItemsSkeleton, undefined, string>[] = []
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

export const createFeaturedMapsDTO = async (featuredMaps: Entry<TypeFeaturedMapsSkeleton, undefined, string>[]) => {
  const [{ draftIds, changedIds }, newMapIds] = await Promise.all([
    getDraftsOrChanged("featuredMaps"), 
    getAllNewMapIds()
  ])

  return featuredMaps.map(featuredMap => {
    const mapImage = resolveAsset(featuredMap.fields.image)
    const category = resolveEntry(featuredMap.fields.gameCategory)
    const isDraft = draftIds.has(featuredMap.sys.id)
    const isChanged = changedIds.has(featuredMap.sys.id)
    const isNew = !!newMapIds.find(map => map.mapId === featuredMap.sys.id)
    
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
  const [{ draftIds, changedIds }, newCategoryIds] = await Promise.all([
    getDraftsOrChanged("gameCategory"), 
    getAllNewCategoryIds()
  ])

  return gameCategorys.map(gameCategory => {
    const categoryImage = resolveAsset(gameCategory.fields.image)
    const isDraft = draftIds.has(gameCategory.sys.id)
    const isChanged = changedIds.has(gameCategory.sys.id)
    const isNew = !!newCategoryIds.find(category => category.categoryId === gameCategory.sys.id)

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

export const createItemTooltipDTO = (item: Entry<TypeZombieItemsSkeleton, undefined, string>) => {
  const itemImage = resolveAsset(item.fields.image)
  const itemCategory = resolveEntry(item.fields.category)

  return {
    title: item.fields.title,
    image: createImageDTO(itemImage),
    category: itemCategory,
    description: item.fields.description
  }
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
