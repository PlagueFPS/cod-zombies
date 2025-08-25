import type { CollectionConfig } from "payload"

export const legal: CollectionConfig = {
	slug: "legal",
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
			unique: true,
			index: true,
			required: true,
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "content",
			label: "Content",
			type: "richText",
			required: true,
		},
	],
}
