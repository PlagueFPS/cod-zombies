import type { Document } from "@contentful/rich-text-types"
import type { Asset, Entry } from "contentful"
import type { Heading } from "@/components/table-of-contents/table-of-contents"
import type {
	TypeFeaturedMapsSkeleton,
	TypeGameCategorySkeleton,
	TypeReferencedMapsSkeleton,
	TypeZombieAttacksSkeleton,
	ZombieItem,
} from "@/types/contentful-types"
import { Effect, Predicate } from "effect"
import { youtube_url } from "@/components/rich-text/rich-link/rich-link"
import {
	MapCategoryNotFoundError,
	QuestMapNotFoundError,
	ZombieAttackNotFoundError,
} from "@/types/errors"
import { slugify } from "./functions.client"

export const extractHeadings = (body: Document) => {
	const headings: Heading[] = []

	body.content.forEach(node => {
		if (node.nodeType.includes("heading-")) {
			if (node.content[0] && node.content[0].nodeType === "text") {
				headings.push({
					type: node.nodeType,
					text: node.content[0].value,
					id: slugify(node.content[0].value),
				})
			}
		} else if (node.content.some(node => node.nodeType === "hyperlink")) {
			node.content.forEach((node: any) => {
				if (node.nodeType === "hyperlink" && node.data.uri.startsWith(youtube_url)) {
					headings.push({
						type: "heading-3",
						text: node.content[0].value,
						id: slugify(node.content[0].value),
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
	let badgeItems: string[] = []

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
					if (content.value.includes(",")) {
						const items = content.value.split(",").map(item => item.trim())
						badgeItems = [...badgeItems, ...items]
					} else {
						values.push(content.value)
					}
				}
				break
		}
	})

	return {
		values,
		badgeItems,
		embeddedItems: embeddedItems.map(item => createItemTooltipDto(item)),
	}
}

export const calculateSkip = (page: number, limit: number) => {
	return page <= 1 ? 0 : limit * page - limit
}

export const isFirstTimePublish = (createdAt: Date, updatedAt: Date) => {
	return createdAt.getTime() === updatedAt.getTime()
}

export const createItemTooltipDto = (item: ZombieItem) => {
	const itemImage = item.fields.image

	if (Predicate.hasProperty(item.fields, "rarity")) {
		return {
			id: item.sys.id,
			title: item.fields.title,
			image: createImageDto(itemImage),
			description: item.fields.description,
			rarity: item.fields.rarity,
			type: item.fields.type,
		}
	}

	return {
		id: item.sys.id,
		title: item.fields.title,
		image: createImageDto(itemImage),
		description: item.fields.description,
	}
}

export const createImageDto = (image: Asset<undefined, string> | undefined) => {
	return {
		url: image?.fields.file?.url,
		width: image?.fields.file?.details?.image?.width,
		height: image?.fields.file?.details?.image?.height,
	}
}
export const createMapCategoryDto = Effect.fn("createMapCategoryDto")(
	function* (
		category: Entry<TypeGameCategorySkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string> | undefined,
	) {
		if (!category)
			return yield* new MapCategoryNotFoundError({
				message: "Expected map to have a category",
			})

		return {
			title: category.fields.title,
			slug: category.fields.slug,
		}
	},
	Effect.tapError(Effect.logError),
	Effect.catchAll(error => Effect.dieMessage(error.message)),
)

export const createQuestMapDto = Effect.fn("createQuestMapDto")(
	function* <T extends TypeReferencedMapsSkeleton | TypeFeaturedMapsSkeleton>(
		map: Entry<T, "WITHOUT_UNRESOLVABLE_LINKS", string> | undefined,
	) {
		if (!map)
			return yield* new QuestMapNotFoundError({
				message: "Expected quest to have a map",
			})

		return {
			title: map.fields.title,
			slug: map.fields.slug,
		}
	},
	Effect.tapError(Effect.logError),
	Effect.catchAll(error => Effect.dieMessage(error.message)),
)

export const createZombieAttackDto = Effect.fn("createZombieAttackDto")(
	function* (
		attack: Entry<TypeZombieAttacksSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string> | undefined,
	) {
		if (!attack)
			return yield* new ZombieAttackNotFoundError({
				message: "Expected zombie to have an attack",
			})

		return {
			id: attack.sys.id,
			name: attack.fields.name,
			range: attack.fields.range,
			description: attack.fields.description,
		}
	},
	Effect.tapError(Effect.logError),
	Effect.catchAll(error => Effect.dieMessage(error.message)),
)
