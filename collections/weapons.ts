import type { CollectionConfig } from "payload"

export const weapons: CollectionConfig = {
	slug: "weapons",
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
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
		},
	],
}
