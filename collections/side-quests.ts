import type { CollectionConfig } from "payload"
import { isAuthenticated, isAuthenticatedOrPublished } from "./access/access-control"
import { CheckNewDate } from "./hooks/check-new-date"
import { formatSlug } from "./hooks/format-slug"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"
import { triggerBroadcast } from "./hooks/trigger-broadcast"

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
		defaultColumns: ["title", "state", "map", "status", "updatedAt"],
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
			name: "newAt",
			label: "Marked 'New' date",
			type: "date",
			admin: {
				description: "Timestamp of when this main quest was marked as 'New'.",
				readOnly: true,
				position: "sidebar",
				date: {
					displayFormat: "MMMM dd, yyyy hh:mm a",
					pickerAppearance: "dayAndTime",
				},
			},
			hooks: {
				beforeValidate: [CheckNewDate],
			},
		},
		{
			name: "state",
			label: "State",
			type: "select",
			options: [
				{ label: "Coming Soon", value: "Coming Soon" },
				{ label: "New", value: "New" },
			],
			admin: {
				description:
					"State this main quest should release in. Note: The 'New' state will automatically be removed two weeks after it is marked as 'New'.",
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
		afterChange: [revalidateCollection, triggerBroadcast],
		afterDelete: [handleDelete],
	},
}
