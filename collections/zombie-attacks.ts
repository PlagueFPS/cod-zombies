import type { CollectionConfig } from "payload"

export const ZombieAttacks: CollectionConfig = {
	slug: "zombieAttacks",
	admin: {
		useAsTitle: "title",
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
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
			required: true,
		},
	],
}
