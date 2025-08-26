import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"

export const Zombies: CollectionConfig = {
	slug: "zombies",
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
			required: true,
			index: true,
			unique: true,
			admin: {
				position: "sidebar",
			},
			hooks: {
				beforeValidate: [formatSlug("title")],
			},
		},
		{
			name: "releaseDate",
			label: "Release Date",
			type: "date",
			required: true,
		},
		{
			name: "isComingSoon",
			type: "checkbox",
			required: true,
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
		},
		{
			name: "description",
			label: "Description",
			type: "text",
			required: true,
		},
		{
			name: "games",
			label: "Games",
			type: "relationship",
			relationTo: "games",
			hasMany: true,
			required: true,
		},
		{
			name: "maps",
			label: "Maps",
			type: "relationship",
			relationTo: "maps",
			hasMany: true,
			required: true,
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
		},
		{
			name: "weakPoints",
			label: "Weak Points",
			type: "text",
			hasMany: true,
			required: true,
		},
		{
			name: "elementalWeakness",
			label: "Elemental Weakness",
			type: "relationship",
			relationTo: "ammoMods",
			hasMany: true,
		},
		{
			name: "attacks",
			label: "Attacks",
			type: "relationship",
			relationTo: "zombieAttacks",
			hasMany: true,
			required: true,
		},
		{
			name: "spawnBehavior",
			label: "Spawn Behavior",
			type: "textarea",
			required: true,
		},
		{
			name: "combatStrategy",
			label: "Combat Strategy",
			type: "richText",
			required: true,
		},
	],
}
