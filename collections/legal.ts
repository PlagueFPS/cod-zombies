import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"

export const Legal: CollectionConfig = {
	slug: "legal",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "status", "updatedAt"],
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
			index: true,
			required: true,
			admin: {
				description: "Title of the legal document.",
			},
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
				description: "Unique slug for the legal document. Used to form the canonical URL.",
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
			admin: {
				description: "Contents of the legal document.",
			},
		},
	],
}
