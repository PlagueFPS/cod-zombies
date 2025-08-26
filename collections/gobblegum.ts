import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"

export const Gobblegum: CollectionConfig = {
	slug: "gobblegum",
	admin: {
		useAsTitle: "title",
	},
	defaultPopulate: {
		title: true,
		slug: true,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
		},
		{
			name: "slug",
			label: "Slug",
			type: "text",
			required: true,
			unique: true,
			index: true,
			admin: {
				position: "sidebar",
			},
			hooks: {
				beforeValidate: [formatSlug("title")],
			},
		},
		{
			name: "rarity",
			label: "Rarity",
			type: "select",
			options: [
				{ label: "Classic", value: "Classic" },
				{ label: "Mega", value: "Mega" },
				{ label: "Rare-Mega", value: "Rare-Mega" },
				{ label: "Ultra-Rare Mega", value: "Ultra-Rare Mega" },
				{ label: "Rare", value: "Rare" },
				{ label: "Epic", value: "Epic" },
				{ label: "Legendary", value: "Legendary" },
				{ label: "Ultra", value: "Ultra" },
			],
			required: true,
		},
		{
			name: "type",
			label: "Type",
			type: "select",
			options: [
				{ label: "Round-Based", value: "Round-Based" },
				{ label: "Time-Based", value: "Time-Based" },
				{ label: "Immediate", value: "Immediate" },
				{ label: "Player-Activated", value: "Player-Activated" },
			],
			required: true,
		},
		{
			name: "game",
			label: "Game",
			type: "relationship",
			relationTo: "games",
			required: true,
		},
		{
			name: "image",
			label: "Image",
			type: "relationship",
			relationTo: "media",
			required: true,
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
			required: true,
		},
	],
}
