import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"

export const Legal: CollectionConfig = {
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
			hooks: {
				beforeValidate: [formatSlug("title")],
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
