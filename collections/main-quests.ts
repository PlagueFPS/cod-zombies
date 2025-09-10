import type { CollectionConfig } from "payload"
import { isAuthenticated, isAuthenticatedOrPublished } from "./access/access-control"
import { CheckNewDate } from "./hooks/check-new-date"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"
import { triggerBroadcast } from "./hooks/trigger-broadcast"

export const MainQuests: CollectionConfig = {
	slug: "mainQuests",
	access: {
		read: isAuthenticatedOrPublished,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "state", "map", "_status", "updatedAt"],
	},
	defaultPopulate: {
		title: true,
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
			required: true,
			index: true,
			unique: true,
			admin: {
				description: "Title of the main quest.",
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
			name: "difficulty",
			label: "Difficulty",
			type: "select",
			options: [
				{ label: "Easy", value: "Easy" },
				{ label: "Medium", value: "Medium" },
				{ label: "Hard", value: "Hard" },
			],
			admin: {
				description: "Difficulty of the main quest.",
			},
		},
		{
			name: "map",
			label: "Map",
			type: "relationship",
			relationTo: "maps",
			required: true,
			unique: true,
			admin: {
				description: "Map this main quest belongs to.",
			},
		},
		{
			name: "content",
			label: "Content",
			type: "richText",
			required: true,
			admin: {
				description: "Contents of the main quest.",
			},
		},
	],
	hooks: {
		afterChange: [revalidateCollection, triggerBroadcast],
		afterDelete: [handleDelete],
	},
}
