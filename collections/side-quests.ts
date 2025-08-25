import type { CollectionConfig } from "payload"

export const sideQuests: CollectionConfig = {
	slug: "side-quests",
	admin: {
		useAsTitle: "title",
	},
	defaultPopulate: {
		title: true,
		slug: true,
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
		},
		{
			name: "slug",
			label: "Slug",
			type: "text",
			required: true,
			index: true,
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "game",
			label: "Game",
			type: "relationship",
			relationTo: "games",
			required: true,
		},
		{
			name: "map",
			label: "Map",
			type: "relationship",
			relationTo: "maps",
			required: true,
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
		},
		{
			name: "description",
			label: "Description",
			type: "text",
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
