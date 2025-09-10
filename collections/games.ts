import type { CollectionConfig } from "payload"
import { anyone, isAuthenticated } from "./access/access-control"
import { formatSlug } from "./hooks/format-slug"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"

export const Games: CollectionConfig = {
	slug: "games",
	access: {
		read: anyone,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		enableListViewSelectAPI: true,
		defaultColumns: ["title", "releaseDate", "updatedAt"],
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
			index: true,
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
					displayFormat: "MM dd, yyyy hh:mm a",
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
				description: "Maps that are featured in this game.",
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
				description: "Perks that are featured in this game.",
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
				description: "Field upgrades that are featured in this game.",
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
				description: "Gobblegum that are featured in this game.",
			},
		},
		{
			name: "weapons",
			label: "Weapons",
			type: "join",
			collection: "weapons",
			on: "games",
			hasMany: true,
			admin: {
				description: "Weapons that are featured in this game.",
			},
		},
	],
	hooks: {
		afterChange: [revalidateCollection],
		afterDelete: [handleDelete],
	},
}
