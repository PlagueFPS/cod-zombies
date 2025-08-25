import type { CollectionConfig } from "payload"

export const ammoMods: CollectionConfig = {
	slug: "ammo-mods",
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
			index: true,
			unique: true,
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "game",
			label: "Game",
			type: "relationship",
			relationTo: "games",
			required: true,
		},
		{
			name: "image",
			label: "Image",
			type: "upload",
			relationTo: "media",
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
			required: true,
		},
	],
}
