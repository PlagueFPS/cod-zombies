import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"

export const Weapons: CollectionConfig = {
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
			admin: {
				position: "sidebar",
			},
			hooks: {
				beforeValidate: [formatSlug("title")],
			},
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
		},
	],
}
