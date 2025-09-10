import type { CollectionConfig } from "payload"
import { anyone, isAuthenticated } from "./access/access-control"

export const Weapons: CollectionConfig = {
	slug: "weapons",
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
			required: true,
			admin: {
				description: "Name of the weapon.",
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
				description: "Games this weapon is featured in.",
			},
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: {
				description: "Featured image of this weapon.",
			},
		},
		{
			name: "weaponBuilds",
			label: "Weapon Builds",
			type: "join",
			collection: "weaponBuilds",
			on: "weapon",
			hasMany: true,
			admin: {
				description: "Weapon builds that belong to this weapon.",
			},
		},
	],
}
