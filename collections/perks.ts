import type { CollectionConfig } from "payload"
import { anyone, isAuthenticated } from "./access/access-control"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"

export const Perks: CollectionConfig = {
	slug: "perks",
	access: {
		read: anyone,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		enableListViewSelectAPI: true,
		defaultColumns: ["title", "game", "updatedAt"],
	},
	defaultPopulate: {
		title: true,
		game: true,
	},
	defaultSort: "-createdAt",
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			index: true,
			required: true,
			admin: {
				description: "Name of the perk.",
			},
		},
		{
			name: "game",
			label: "Game",
			type: "relationship",
			relationTo: "games",
			required: true,
			admin: {
				description: "Game this perk belongs to.",
			},
		},
		{
			name: "image",
			label: "Image",
			type: "relationship",
			relationTo: "media",
			required: true,
			admin: {
				description: "Featured image of this perk.",
			},
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
			required: true,
			admin: {
				description: "Description used in tooltips and hover cards.",
			},
		},
		{
			name: "modifier",
			label: "Modifier",
			type: "textarea",
			admin: {
				description: "Modifier used in tooltips and hover cards.",
			},
		},
		{
			name: "augments",
			label: "Augments",
			type: "join",
			collection: "augments",
			on: "perk",
			hasMany: true,
			admin: {
				description: "Augments that belong to this perk.",
			},
		},
	],
	hooks: {
		afterDelete: [handleDelete],
		afterChange: [revalidateCollection],
	},
}
