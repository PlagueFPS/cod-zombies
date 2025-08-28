import type { CollectionConfig } from "payload"

export const WeaponBuilds: CollectionConfig = {
	slug: "weaponBuilds",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "weapon", "updatedAt"],
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
				description: "Name of the weapon build.",
			},
		},
		{
			name: "weapon",
			label: "Weapon",
			type: "relationship",
			relationTo: "weapons",
			required: true,
			admin: {
				description: "Weapon this build belongs to.",
			},
		},
		{
			name: "attachments",
			label: "Attachments",
			type: "text",
			hasMany: true,
			admin: {
				condition: data => {
					return Boolean(data?.buildCode) === false
				},
				description: "Attachments that belong to this weapon build.",
			},
		},
		{
			name: "buildCode",
			label: "Build Code",
			type: "text",
			admin: {
				condition: data => {
					return Boolean(data?.attachments?.length) === false
				},
				description: "Build code of the weapon build.",
			},
		},
	],
}
