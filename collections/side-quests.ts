import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"
import { revalidateCollection } from "./hooks/revalidation"

export const SideQuests: CollectionConfig = {
	slug: "sideQuests",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "map", "status", "updatedAt"],
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
				description: "Name of the side quest.",
			},
		},
		{
			name: "slug",
			label: "Slug",
			type: "text",
			required: true,
			index: true,
			admin: {
				position: "sidebar",
				description: "Unique slug for the side quest. Used to form the canonical URL.",
			},
			hooks: {
				beforeValidate: [formatSlug("title")],
			},
		},
		{
			name: "map",
			label: "Map",
			type: "relationship",
			relationTo: "maps",
			required: true,
			admin: {
				description: "Map this side quest belongs to.",
			},
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
			admin: {
				description: "Featured image of this side quest.",
			},
		},
		{
			name: "description",
			label: "Description",
			type: "text",
			required: true,
			admin: {
				description: "SEO description used in meta tags and in preview cards.",
			},
		},
		{
			name: "content",
			label: "Content",
			type: "richText",
			required: true,
			admin: {
				description: "Contents of the side quest.",
			},
		},
	],
	hooks: {
		afterChange: [revalidateCollection],
	},
}
