import type { CollectionConfig } from "payload"
import { isAuthenticated, isAuthenticatedOrPublished } from "./access/access-control"
import { CheckNewDate } from "./hooks/check-new-date"
import { formatSlug } from "./hooks/format-slug"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"
import { triggerBroadcast } from "./hooks/trigger-broadcast"

export const Zombies: CollectionConfig = {
	slug: "zombies",
	access: {
		read: isAuthenticatedOrPublished,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		enableListViewSelectAPI: true,
		defaultColumns: ["title", "state", "type", "status", "updatedAt"],
	},
	defaultSort: "-releaseDate",
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
				description: "Name of the zombie.",
			},
		},
		{
			name: "slug",
			label: "Slug",
			type: "text",
			required: true,
			index: true,
			unique: true,
			admin: {
				position: "sidebar",
				description: "Unique slug for the zombie. Used to form the canonical URL.",
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
			name: "releaseDate",
			label: "Release Date",
			type: "date",
			index: true,
			required: true,
			admin: {
				description: "Release date of the zombie.",
				date: {
					displayFormat: "MMMM dd, yyyy hh:mm a",
					pickerAppearance: "dayAndTime",
				},
			},
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: {
				description: "Featured image of this zombie.",
			},
		},
		{
			name: "description",
			label: "Description",
			type: "text",
			required: true,
			admin: {
				description:
					"SEO description used in meta tags, tooltips, hover cards, and in preview cards.",
			},
		},
		{
			name: "games",
			label: "Games",
			type: "relationship",
			relationTo: "games",
			hasMany: true,
			required: true,
			admin: {
				description: "Games this zombie is featured in.",
			},
		},
		{
			name: "maps",
			label: "Maps",
			type: "relationship",
			relationTo: "maps",
			hasMany: true,
			required: true,
			admin: {
				description: "Maps this zombie is featured in.",
			},
		},
		{
			name: "type",
			label: "Type",
			type: "select",
			options: [
				{ label: "Normal", value: "Normal" },
				{ label: "Special", value: "Special" },
				{ label: "Elite", value: "Elite" },
				{ label: "Boss", value: "Boss" },
			],
			required: true,
			admin: {
				description: "Type of the zombie.",
			},
		},
		{
			name: "speed",
			label: "Speed",
			type: "select",
			options: [
				{ label: "Slow", value: "Slow" },
				{ label: "Medium", value: "Medium" },
				{ label: "Fast", value: "Fast" },
			],
			required: true,
			admin: {
				description: "Speed of the zombie.",
			},
		},
		{
			name: "weakPoints",
			label: "Weak Points",
			type: "relationship",
			relationTo: "weakPoints",
			hasMany: true,
			admin: {
				description: "Weak points of the zombie.",
			},
		},
		{
			name: "elementalWeakness",
			label: "Elemental Weakness",
			type: "relationship",
			relationTo: "ammoMods",
			hasMany: true,
			admin: {
				description: "Elemental weaknesses of the zombie.",
				appearance: "drawer",
			},
		},
		{
			name: "attacks",
			label: "Attacks",
			type: "relationship",
			relationTo: "zombieAttacks",
			hasMany: true,
			required: true,
			admin: {
				description: "Attacks of the zombie.",
			},
		},
		{
			name: "spawnBehavior",
			label: "Spawn Behavior",
			type: "textarea",
			required: true,
			admin: {
				description: "Spawn behavior of the zombie.",
			},
		},
		{
			name: "combatStrategy",
			label: "Combat Strategy",
			type: "richText",
			required: true,
			admin: {
				description: "Combat strategy of the zombie.",
			},
		},
	],
	hooks: {
		afterChange: [revalidateCollection, triggerBroadcast],
		afterDelete: [handleDelete],
	},
}
