import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"

export const Maps: CollectionConfig = {
	slug: "maps",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "releaseDate", "updatedAt"],
	},
	defaultPopulate: {
		title: true,
		slug: true,
		releaseDate: true,
	},
	defaultSort: "-releaseDate",
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
			admin: {
				description: "Name of the map.",
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
				description: "Unique slug for the map. Used to form the canonical URL.",
			},
			hooks: {
				beforeValidate: [formatSlug("title")],
			},
		},
		{
			name: "releaseDate",
			label: "Release Date",
			type: "date",
			admin: {
				date: {
					displayFormat: "MMMM dd, yyyy hh:mm a",
					pickerAppearance: "dayAndTime",
				},
				description: "Release date of the map.",
			},
			required: true,
		},
		{
			name: "game",
			label: "Game",
			type: "relationship",
			relationTo: "games",
			required: true,
			admin: {
				description: "Game this map belongs to.",
			},
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: {
				description: "Featured image of this map.",
			},
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
			maxLength: 255,
			required: true,
			admin: {
				description: "SEO description used in meta tags and in preview cards.",
			},
		},
		{
			name: "mainQuest",
			label: "Main Quest",
			type: "join",
			collection: "mainQuests",
			on: "map",
			admin: {
				description: "Main quest that belongs to this map.",
			},
		},
		{
			name: "sideQuests",
			label: "Side Quests",
			type: "join",
			collection: "sideQuests",
			on: "map",
			hasMany: true,
			admin: {
				description: "Side quests that belong to this map.",
			},
		},
		{
			name: "zombies",
			label: "Zombies",
			type: "join",
			collection: "zombies",
			on: "maps",
			hasMany: true,
			admin: {
				description: "Zombies that belong to this map.",
			},
		},
	],
}
