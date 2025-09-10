import type { CollectionConfig } from "payload"
import { isAuthenticated, isAuthenticatedOrPublished } from "./access/access-control"
import { formatSlug } from "./hooks/format-slug"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"

export const Legal: CollectionConfig = {
	slug: "legal",
	access: {
		read: isAuthenticatedOrPublished,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		enableListViewSelectAPI: true,
		defaultColumns: ["title", "status", "updatedAt"],
	},
	defaultPopulate: {
		title: true,
		slug: true,
	},
	versions: {
		drafts: true,
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
	hooks: {
		afterDelete: [handleDelete],
		afterChange: [revalidateCollection],
	},
}
