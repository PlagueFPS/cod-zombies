import type { CollectionConfig } from "payload"
import { anyone, isAuthenticated } from "./access/access-control"
import { handleDelete } from "./hooks/handle-delete"
import { revalidateCollection } from "./hooks/revalidation"

export const Augments: CollectionConfig = {
	slug: "augments",
	access: {
		read: anyone,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "type", "updatedAt"],
	},
	defaultPopulate: {
		title: true,
		type: true,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			index: true,
			required: true,
			admin: {
				description: "Name of the augment.",
			},
		},
		{
			name: "type",
			label: "Type",
			type: "select",
			options: [
				{ label: "Major", value: "Major" },
				{ label: "Minor", value: "Minor" },
			],
			required: true,
			admin: {
				description: "Type of the augment.",
			},
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
			required: true,
			admin: {
				description: "Featured image of this augment.",
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
			name: "perk",
			label: "Perk",
			type: "relationship",
			relationTo: "perks",
			admin: {
				condition: data => {
					return Boolean(data?.ammoMod) === false && Boolean(data?.fieldUpgrade) === false
				},
				description: "Perk this augment belongs to.",
				appearance: "drawer",
			},
		},
		{
			name: "ammoMod",
			label: "Ammo Mod",
			type: "relationship",
			relationTo: "ammoMods",
			admin: {
				condition: data => {
					return Boolean(data?.perk) === false && Boolean(data?.fieldUpgrade) === false
				},
				description: "Ammo mod this augment belongs to.",
				appearance: "drawer",
			},
		},
		{
			name: "fieldUpgrade",
			label: "Field Upgrade",
			type: "relationship",
			relationTo: "fieldUpgrades",
			admin: {
				condition: data => {
					return Boolean(data?.perk) === false && Boolean(data?.ammoMod) === false
				},
				description: "Field upgrade this augment belongs to.",
				appearance: "drawer",
			},
		},
	],
	hooks: {
		afterDelete: [handleDelete],
		afterChange: [revalidateCollection],
	},
}
