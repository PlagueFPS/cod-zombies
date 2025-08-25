import type { CollectionConfig } from "payload"

export const games: CollectionConfig = {
	slug: "games",
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
			index: true,
			unique: true,
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "releaseDate",
			label: "Release Date",
			type: "date",
			required: true,
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
		},
	],
}
