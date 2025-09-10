import type { CollectionConfig } from "payload"
import { anyone, isAuthenticated } from "./access/access-control"

export const WeakPoints: CollectionConfig = {
	slug: "weakPoints",
	access: {
		read: anyone,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		enableListViewSelectAPI: true,
		defaultColumns: ["title", "updatedAt"],
	},
	defaultPopulate: {
		title: true,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			index: true,
			unique: true,
			required: true,
			admin: {
				description: "Name of the weak point.",
			},
		},
		{
			name: "zombies",
			label: "Zombies",
			type: "join",
			collection: "zombies",
			on: "weakPoints",
			hasMany: true,
			admin: {
				description: "Zombies that have this weak point.",
			},
		},
	],
}
