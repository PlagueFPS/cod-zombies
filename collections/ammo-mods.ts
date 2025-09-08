import type { CollectionConfig } from "payload"

export const AmmoMods: CollectionConfig = {
	slug: "ammoMods",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "game", "updatedAt"],
	},
	defaultPopulate: {
		title: true,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
			index: true,
			admin: {
				description: "Name of the ammo mod.",
			},
		},
		{
			name: "game",
			label: "Game",
			type: "relationship",
			relationTo: "games",
			required: true,
			admin: {
				description: "Game this ammo mod belongs to.",
			},
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: {
				description: "Featured image of this ammo mod.",
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
			on: "ammoMod",
			hasMany: true,
			admin: {
				description: "Augments that belong to this ammo mod.",
			},
		},
		{
			name: "zombies",
			label: "Zombies",
			type: "join",
			collection: "zombies",
			on: "elementalWeakness",
			hasMany: true,
			admin: {
				description: "Zombies that are weak to this ammo mod.",
			},
		},
	],
}
