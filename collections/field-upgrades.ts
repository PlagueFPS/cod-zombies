import type { CollectionConfig } from "payload"
import { anyone, isAuthenticated } from "./access/access-control"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"

export const FieldUpgrades: CollectionConfig = {
	slug: "fieldUpgrades",
	access: {
		read: anyone,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "game", "updatedAt"],
	},
	defaultPopulate: {
		title: true,
		game: true,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			index: true,
			required: true,
			admin: {
				description: "Name of the field upgrade.",
			},
		},
		{
			name: "game",
			label: "Game",
			type: "relationship",
			relationTo: "games",
			required: true,
			admin: {
				description: "Game this field upgrade belongs to.",
			},
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: {
				description: "Featured image of this field upgrade.",
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
			name: "augments",
			label: "Augments",
			type: "join",
			collection: "augments",
			on: "fieldUpgrade",
			hasMany: true,
			admin: {
				description: "Augments that belong to this field upgrade.",
			},
		},
	],
	hooks: {
		afterDelete: [handleDelete],
		afterChange: [revalidateCollection],
	},
}
