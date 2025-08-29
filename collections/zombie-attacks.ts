import type { CollectionConfig } from "payload"

export const ZombieAttacks: CollectionConfig = {
	slug: "zombieAttacks",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "range", "updatedAt"],
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
				description: "Name of the zombie attack.",
			},
		},
		{
			name: "range",
			label: "Range",
			type: "select",
			required: true,
			options: [
				{ label: "Short", value: "Short" },
				{ label: "Medium", value: "Medium" },
				{ label: "Long", value: "Long" },
			],
			admin: {
				description: "Range of the zombie attack.",
			},
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
			required: true,
			admin: {
				description: "Description of the zombie attack.",
			},
		},
		{
			name: "zombies",
			label: "Zombies",
			type: "join",
			collection: "zombies",
			on: "attacks",
			hasMany: true,
			admin: {
				description: "Zombies that use this attack.",
			},
		},
	],
}
