import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"

export const Zombies: CollectionConfig = {
	slug: "zombies",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "isComingSoon", "type", "status", "updatedAt"],
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
			name: "isComingSoon",
			label: "Coming Soon",
			type: "checkbox",
			defaultValue: false,
			admin: {
				description:
					"Determines if this zombie should show a 'Coming Soon' badge and have the main page not be accessible.",
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
			type: "text",
			hasMany: true,
			required: true,
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
}
