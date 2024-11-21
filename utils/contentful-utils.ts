import type { Asset, Entry, UnresolvedLink, EntrySkeletonType } from "contentful";
import type { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton, ZombieItem } from "@/contentful/Types/contentful-types";
import type { Heading } from "@/types/Heading";
import type { Document } from "@contentful/rich-text-types";
import { slugify } from "./functions";
import { getAllNewMapIds, getDraftsOrChanged } from "@/data/featuredMaps";
import { getAllNewCategoryIds, getGameCategoryById } from "@/data/gameCategory";
import { IN_DEVELOPMENT, MAP_ORDER } from "./constants";

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

export const formatTableCellData = async (cellContent: any[]) => {
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
    embeddedItems: await Promise.all(embeddedItems.map(async item => await createItemTooltipDTO(item)))
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

  return await Promise.all(featuredMaps.map(async featuredMap => {
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
      category: await createMapCategoryDTO(category),
      isDraft: isDraft,
      isChanged: isChanged,
      isNew: isNew
    }
  }))
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

export const createItemTooltipDTO = async (item: ZombieItem) => {
  const itemImage = resolveAsset(item.fields.image)
  const itemCategory = resolveEntry(item.fields.game)

  if ('rarity' in item.fields) {
    return {
      title: item.fields.title,
      image: createImageDTO(itemImage),
      category: await createMapCategoryDTO(itemCategory),
      description: item.fields.description,
      rarity: item.fields.rarity,
      type: item.fields.type
    }
  }

  return {
    title: item.fields.title,
    image: createImageDTO(itemImage),
    category: await createMapCategoryDTO(itemCategory, item.fields.game.sys.id),
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

const createMapCategoryDTO = async (category: Entry<TypeGameCategorySkeleton, undefined, string> | undefined, gameCategoryId?: string) => {
  if (!category && gameCategoryId) {
    const category = await getGameCategoryById(IN_DEVELOPMENT, gameCategoryId)
    if (!category) throw new Error("Expected category to exist")

    return {
      title: category.title,
      slug: category.slug
    }
  }

  if (!category) throw new Error("Expected map to have a category")
  return {
    title: category.fields.title,
    slug: category.fields.slug
  }
}
