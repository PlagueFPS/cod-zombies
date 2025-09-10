import type { CollectionConfig } from "payload"
import { anyone, isAuthenticated } from "./access/access-control"

export const WeaponAttachments: CollectionConfig = {
	slug: "weaponAttachments",
	access: {
		read: anyone,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	admin: {
		useAsTitle: "title",
		enableListViewSelectAPI: true,
		defaultColumns: ["title", "type", "updatedAt"],
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
				description: "Name of the weapon attachment.",
			},
		},
		{
			name: "type",
			label: "Type",
			type: "select",
			options: [
				{
					label: "Optic",
					value: "Optic",
				},
				{
					label: "Muzzle",
					value: "Muzzle",
				},
				{
					label: "Barrel",
					value: "Barrel",
				},
				{
					label: "Underbarrel",
					value: "Underbarrel",
				},
				{
					label: "Magazine",
					value: "Magazine",
				},
				{
					label: "Grip",
					value: "Grip",
				},
				{
					label: "Comb",
					value: "Comb",
				},
				{
					label: "Stock",
					value: "Stock",
				},
				{
					label: "Laser",
					value: "Laser",
				},
				{
					label: "Fire Mod",
					value: "Fire Mod",
				},
			],
			required: true,
			admin: {
				description: "Type of the weapon attachment.",
			},
		},
		{
			name: "builds",
			label: "Weapon Builds",
			type: "join",
			collection: "weaponBuilds",
			on: "attachments",
			hasMany: true,
			admin: {
				description: "Weapon builds that use this attachment.",
			},
		},
	],
}
