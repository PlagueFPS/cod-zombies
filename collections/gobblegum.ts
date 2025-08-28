import type { CollectionConfig } from "payload"

export const Gobblegum: CollectionConfig = {
	slug: "gobblegum",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "rarity", "game", "updatedAt"],
	},
	defaultPopulate: {
		title: true,
		game: true,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			index: true,
			required: true,
			admin: {
				description: "Name of the gobblegum.",
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
			admin: {
				description: "Rarity of the gobblegum.",
			},
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
			admin: {
				description: "Type of the gobblegum.",
			},
		},
		{
			name: "game",
			label: "Game",
			type: "relationship",
			relationTo: "games",
			required: true,
			admin: {
				description: "Game this gobblegum belongs to.",
			},
		},
		{
			name: "image",
			label: "Image",
			type: "relationship",
			relationTo: "media",
			required: true,
			admin: {
				description: "Featured image of this gobblegum.",
			},
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
			required: true,
			admin: {
				description: "Description used in tooltips and hover cards.",
			},
		},
	],
}
