import type { CollectionConfig } from "payload"
import { isAuthenticated, isAuthenticatedOrPublished } from "./access/access-control"
import { CheckPublishDate } from "./hooks/check-publish-date"
import { formatSlug } from "./hooks/format-slug"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"

export const SideQuests: CollectionConfig = {
	slug: "sideQuests",
	access: {
		read: isAuthenticatedOrPublished,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
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
			unique: true,
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
			name: "firstPublishedAt",
			type: "date",
			admin: {
				description: "Timestamp of when this side quest was first published.",
				readOnly: true,
				position: "sidebar",
				date: {
					displayFormat: "MM dd yyyy hh:mm a",
					pickerAppearance: "dayAndTime",
				},
			},
			hooks: {
				beforeChange: [CheckPublishDate],
			},
		},
		{
			name: "isComingSoon",
			type: "checkbox",
			defaultValue: false,
			admin: {
				description:
					"Determines if this quest should show a 'Coming Soon' badge and have the main page not be accessible.",
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
		afterDelete: [handleDelete],
	},
}
