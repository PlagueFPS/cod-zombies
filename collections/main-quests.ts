import type { CollectionConfig } from "payload"

export const mainQuests: CollectionConfig = {
	slug: "main-quests",
	admin: {
		useAsTitle: "title",
	},
	defaultPopulate: {
		title: true,
	},
	versions: {
		drafts: {
			autosave: true,
		},
		maxPerDoc: 3,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
			unique: true,
		},
		{
			name: "isComingSoon",
			type: "checkbox",
			required: true,
		},
		{
			name: "difficulty",
			label: "Difficulty",
			type: "select",
			options: [
				{ label: "Easy", value: "Easy" },
				{ label: "Medium", value: "Medium" },
				{ label: "Hard", value: "Hard" },
			],
		},
		{
			name: "map",
			label: "Map",
			type: "relationship",
			relationTo: "maps",
			required: true,
			unique: true,
		},
		{
			name: "game",
			label: "Game",
			type: "relationship",
			relationTo: "games",
			required: true,
		},
		{
			name: "content",
			label: "Content",
			type: "richText",
			required: true,
		},
	],
}
