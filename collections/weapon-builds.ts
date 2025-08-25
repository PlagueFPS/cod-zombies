import type { CollectionConfig } from "payload"

export const WeaponBuilds: CollectionConfig = {
	slug: "weapon-builds",
	admin: {
		useAsTitle: "title",
	},
	defaultPopulate: {
		title: true,
		slug: true,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
		},
		{
			name: "slug",
			label: "Slug",
			type: "text",
			required: true,
			unique: true,
		},
		{
			name: "weapon",
			label: "Weapon",
			type: "relationship",
			relationTo: "weapons",
			required: true,
		},
		{
			name: "attachments",
			label: "Attachments",
			type: "text",
			hasMany: true,
			admin: {
				condition: data => {
					if (data?.buildCode) return false
					return true
				},
			},
		},
		{
			name: "buildCode",
			label: "Build Code",
			type: "text",
			admin: {
				condition: data => {
					if (data?.attachments?.length > 0) return false
					return true
				},
			},
		},
	],
}
