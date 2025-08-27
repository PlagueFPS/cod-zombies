import type { CollectionConfig } from "payload"

export const Perks: CollectionConfig = {
	slug: "perks",
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
