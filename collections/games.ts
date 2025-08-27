import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"

export const Games: CollectionConfig = {
	slug: "games",
	admin: {
		useAsTitle: "title",
	},
	defaultPopulate: {
		title: true,
		slug: true,
	},
	defaultSort: "-releaseDate",
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
			admin: {
				description: "Name of the game.",
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
				description: "Unique slug for the game. Used to form the canonical URL.",
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
			admin: {
				date: {
					displayFormat: "MMMM dd, yyyy hh:mm a",
					pickerAppearance: "dayAndTime",
				},
				description: "Release date of the game.",
			},
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: {
				description: "Cover image of the game.",
			},
		},
		{
			name: "maps",
			label: "Maps",
			type: "join",
			collection: "maps",
			on: "game",
			hasMany: true,
			admin: {
				description: "Maps that belong to this game.",
			},
		},
		{
			name: "perks",
			label: "Perks",
			type: "join",
			collection: "perks",
			on: "game",
			hasMany: true,
			admin: {
				description: "Perks that belong to this game.",
			},
		},
		{
			name: "fieldUpgrades",
			label: "Field Upgrades",
			type: "join",
			collection: "fieldUpgrades",
			on: "game",
			hasMany: true,
			admin: {
				description: "Field upgrades that belong to this game.",
			},
		},
		{
			name: "gobblegum",
			label: "Gobblegum",
			type: "join",
			collection: "gobblegum",
			on: "game",
			hasMany: true,
			admin: {
				description: "Gobblegum that belong to this game.",
			},
		},
	],
}
