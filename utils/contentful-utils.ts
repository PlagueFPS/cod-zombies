import type { Document } from "@contentful/rich-text-types"
import type { Asset, Entry, EntrySkeletonType, UnresolvedLink } from "contentful"
import type { Heading } from "@/components/table-of-contents/table-of-contents"
import type { FeaturedMap, MinifiedFeaturedMap } from "@/data/maps"
import type { MinifiedSideQuest, SideQuest } from "@/data/side-quests"
import type {
	TypeFeaturedMapsSkeleton,
	TypeGameCategorySkeleton,
	TypeGobblegumsSkeleton,
	TypeReferencedMapsSkeleton,
	TypeWeaponBuildsSkeleton,
	TypeWeaponSkeleton,
	TypeZombieAttacksSkeleton,
	TypeZombiesSkeleton,
	ZombieItem,
} from "@/types/contentful-types"
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer"
import { Predicate } from "effect"
import { youtube_url } from "@/components/rich-text/rich-link/rich-link"
import { getWeapon } from "@/data/weapons"
import {
	MapCategoryNotFoundError,
	QuestMapNotFoundError,
	ZombieAttackNotFoundError,
} from "@/types/errors"
import { slugify } from "./functions.client"
import { decodeRichLinkNode } from "./validation-schemas"

export const resolveAsset = (asset: UnresolvedLink<"Asset"> | Asset<undefined, string>) => {
	if ("fields" in asset && asset.fields) return asset
}

export const resolveEntry = <T extends EntrySkeletonType>(
	entry: UnresolvedLink<"Entry"> | Entry<T, undefined, string>,
) => {
	if ("fields" in entry && entry.fields) return entry
}

/**
 * Extract headings from a Contentful document.
 * @param body The Contentful document
 * @returns An array of headings extracted from the document.
 */
export const extractHeadings = (body: Document) => {
	const headings: Heading[] = []

	body.content.forEach(node => {
		if (
			node.nodeType.includes("heading-") &&
			node.content[0] &&
			node.content[0].nodeType === "text"
		) {
			headings.push({
				type: node.nodeType,
				text: node.content[0].value,
				id: slugify(node.content[0].value),
			})
		} else if (node.content.some(node => node.nodeType === "hyperlink")) {
			// Extract video guides link text into Table of Contents as h3s
			node.content.forEach(node => {
				const linkNode = decodeRichLinkNode(node)
				if (linkNode._tag === "Left") return

				const { data, content } = linkNode.right
				if (data.uri.startsWith(youtube_url) && content[0]) {
					headings.push({
						type: "heading-3",
						text: content[0].value,
						id: slugify(content[0].value),
					})
				}
			})
		}
	})

	return headings
}

/**
 * Calculate the time it takes to read a Contentful document.
 * @param body The Contentful document
 * @returns The time it takes to read the document in minutes.
 */
export const calculateTimeToRead = (body: Document) => {
	const plainText = documentToPlainTextString(body)
	const avgReadingSpeed = 200 // words per minute
	const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
	return Math.ceil(wordCount / avgReadingSpeed) // always use the worst case
}

/**
 * Format the data in a table cell.
 * @param cellContent The content of the table cell
 * @returns An object containing the values, embedded items, and badge items.
 */
export const formatTableCellData = async (cellContent: unknown[]) => {
	const values: string[] = []
	const embeddedItems: ZombieItem[] = []

	cellContent.forEach(content => {
		if (!Predicate.hasProperty(content, "nodeType")) return

		switch (content.nodeType) {
			case "embedded-entry-inline":
				if (
					!Predicate.hasProperty(content, "data") ||
					!Predicate.hasProperty(content.data, "target")
				)
					return

				embeddedItems.push(content.data.target as ZombieItem)
				break
			default: // default in this case is "text"
				if (Predicate.hasProperty(content, "value") && Predicate.isString(content.value)) {
					values.push(content.value)
				}
				break
		}
	})

	return {
		values,
		embeddedItems: await Promise.all(
			embeddedItems.map(async item => await createItemTooltipDto(item)),
		),
	}
}

/**
 * Calculate the number of items to skip based on the page number and limit.
 * @param page The page number
 * @param limit The number of items per page
 * @returns The number of items to skip
 */
export const calculateSkip = (page: number, limit: number) => {
	return page <= 1 ? 0 : limit * page - limit
}

/**
 * Check if an entry was first published.
 * @param createdAt The creation date of the entry
 * @param updatedAt The last update date of the entry
 * @returns True if the entry was first published, false otherwise
 */
export const isFirstTimePublish = (createdAt: Date, updatedAt: Date) => {
	return createdAt.getTime() === updatedAt.getTime()
}

/**
 * Check if an entry is a featured map.
 * @param quest The entry to check
 * @returns True if the entry is a featured map, false otherwise
 */
export const isFeaturedMap = (
	quest: FeaturedMap | MinifiedFeaturedMap | SideQuest | MinifiedSideQuest,
): quest is FeaturedMap | MinifiedFeaturedMap => {
	return Predicate.hasProperty(quest, "difficulty")
}

/**
 * Check if an entry is a side quest.
 * @param quest The entry to check
 * @returns True if the entry is a side quest, false otherwise
 */
export const isSideQuest = (
	quest: FeaturedMap | MinifiedFeaturedMap | SideQuest | MinifiedSideQuest,
): quest is SideQuest | MinifiedSideQuest => {
	return Predicate.hasProperty(quest, "map")
}

/**
 * Check if an entry is a weapon build.
 * @param item The entry to check
 * @returns True if the entry is a weapon build, false otherwise
 */
export const isWeaponBuild = (
	item: ZombieItem,
): item is Entry<TypeWeaponBuildsSkeleton, undefined, string> => {
	return item.sys.contentType.sys.id === "weaponBuilds"
}

/**
 * Check if an entry is a gobble gum.
 * @param item The entry to check
 * @returns True if the entry is a gobble gum, false otherwise
 */
export const isGobbleGum = (
	item: ZombieItem,
): item is Entry<TypeGobblegumsSkeleton, undefined, string> => {
	return item.sys.contentType.sys.id === "gobblegums"
}

/**
 * Check if an entry is a zombie.
 * @param item The entry to check
 * @returns True if the entry is a zombie, false otherwise
 */
export const isZombie = (
	item: ZombieItem,
): item is Entry<TypeZombiesSkeleton, undefined, string> => {
	return item.sys.contentType.sys.id === "zombies"
}

/**
 * Create a Data Transfer Object for a zombie item.
 * @param item The zombie item to create a DTO for
 * @returns The DTO for the zombie item
 */
export const createItemTooltipDto = async (item: ZombieItem) => {
	const itemImage = Predicate.hasProperty(item.fields, "image")
		? resolveAsset(item.fields.image)
		: undefined

	if (isGobbleGum(item)) {
		return {
			_tag: "GOBBLEGUM" as const,
			id: item.sys.id,
			slug: item.fields.slug,
			title: item.fields.title,
			image: createImageDto(itemImage),
			description: item.fields.description,
			rarity: item.fields.rarity,
			type: item.fields.type,
		}
	}

	if (isWeaponBuild(item)) {
		const weapon = await createWeaponDto(item.fields.weapon)
		return {
			_tag: "WEAPON_BUILD" as const,
			id: item.sys.id,
			slug: item.fields.slug,
			title: weapon.title,
			image: createImageDto(itemImage),
			attachments: item.fields.attachments,
		}
	}

	if (isZombie(item)) {
		const weaknesses =
			item.fields.elementalWeakness
				?.map(weakness => {
					const resolvedWeakness = resolveEntry(weakness)
					if (!resolvedWeakness) return null
					return {
						_tag: "OTHER" as const,
						id: resolvedWeakness.sys.id,
						slug: resolvedWeakness.fields.slug,
						title: resolvedWeakness.fields.title,
						image: createImageDto(resolveAsset(resolvedWeakness.fields.image)),
						description: resolvedWeakness.fields.description,
					}
				})
				.filter(weakness => weakness !== null) ?? []

		return {
			_tag: "ZOMBIE" as const,
			id: item.sys.id,
			slug: item.fields.slug,
			title: item.fields.name,
			image: createImageDto(itemImage),
			type: item.fields.type,
			elementalWeaknesses: weaknesses,
			weakPoints: item.fields.weakPoints,
		}
	}

	return {
		_tag: "OTHER" as const,
		id: item.sys.id,
		slug: item.fields.slug,
		title: item.fields.title,
		image: createImageDto(itemImage),
		description: item.fields.description,
	}
}

/**
 * Create a Data Transfer Object for an image.
 * @param image The image to create a DTO for
 * @returns The DTO for the image
 */
export const createImageDto = (image: Asset<undefined, string> | undefined) => {
	return {
		url: image?.fields.file?.url,
		width: image?.fields.file?.details?.image?.width,
		height: image?.fields.file?.details?.image?.height,
	}
}

/**
 * Create a Data Transfer Object for a weapon.
 * @param weapon The weapon to create a DTO for
 * @returns The DTO for the weapon
 */
export const createWeaponDto = async (
	weapon: UnresolvedLink<"Entry"> | Entry<TypeWeaponSkeleton, undefined, string>,
) => {
	if (!weapon)
		throw new Error(
			"Expected weapon. It is either missing or depth is not high enough to populate.",
		)

	if ("fields" in weapon === false) {
		return await getWeapon(weapon.sys.id)
	}

	return {
		id: weapon.sys.id,
		title: weapon.fields.title,
		slug: weapon.fields.slug,
	}
}

/**
 * Create a Data Transfer Object for a map category.
 * @param category The map category to create a DTO for
 * @returns The DTO for the map category
 */
export const createMapCategoryDto = (
	category: Entry<TypeGameCategorySkeleton, undefined, string> | undefined,
) => {
	if (!category)
		throw new MapCategoryNotFoundError({
			message: "Expected map to have a category",
		})

	return {
		title: category.fields.title,
		slug: category.fields.slug,
	}
}

/**
 * Create a Data Transfer Object for a quest map.
 * @param map The quest map to create a DTO for
 * @returns The DTO for the quest map
 */
export const createQuestMapDto = <T extends TypeReferencedMapsSkeleton | TypeFeaturedMapsSkeleton>(
	map: Entry<T, undefined, string> | undefined,
) => {
	if (!map)
		throw new QuestMapNotFoundError({
			message: "Expected quest to have a map",
		})

	return {
		title: map.fields.title,
		slug: map.fields.slug,
	}
}

/**
 * Create a Data Transfer Object for a zombie attack.
 * @param attack The zombie attack to create a DTO for
 * @returns The DTO for the zombie attack
 */
export const createZombieAttackDto = (
	attack: Entry<TypeZombieAttacksSkeleton, undefined, string> | undefined,
) => {
	if (!attack)
		throw new ZombieAttackNotFoundError({
			message: "Expected zombie to have an attack",
		})

	return {
		id: attack.sys.id,
		name: attack.fields.name,
		range: attack.fields.range,
		description: attack.fields.description,
	}
}
