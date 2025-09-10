import type { CollectionConfig } from "payload"
import { anyone, isAuthenticated } from "./access/access-control"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"

export const WeaponBuilds: CollectionConfig = {
	slug: "weaponBuilds",
	access: {
		read: anyone,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		enableListViewSelectAPI: true,
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
			type: "relationship",
			relationTo: "weaponAttachments",
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
			unique: true,
			admin: {
				condition: data => {
					return Boolean(data?.attachments?.length) === false
				},
				description: "Build code of the weapon build.",
			},
		},
	],
	hooks: {
		afterDelete: [handleDelete],
		afterChange: [revalidateCollection],
	},
}
