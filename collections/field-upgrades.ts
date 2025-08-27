import type { CollectionConfig } from "payload"

export const FieldUpgrades: CollectionConfig = {
	slug: "fieldUpgrades",
	admin: {
		useAsTitle: "title",
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
			type: "upload",
			relationTo: "media",
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
			required: true,
		},
	],
}
