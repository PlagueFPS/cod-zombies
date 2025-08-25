import type { CollectionConfig } from "payload"

export const Maps: CollectionConfig = {
	slug: "maps",
	admin: {
		useAsTitle: "title",
	},
	defaultPopulate: {
		title: true,
		slug: true,
		releaseDate: true,
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
			required: true,
		},
		{
			name: "description",
			label: "Description",
			type: "text",
			required: true,
		},
	],
}
