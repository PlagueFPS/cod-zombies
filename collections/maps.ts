import type { CollectionConfig } from "payload"
import { formatSlug } from "./hooks/format-slug"

export const Maps: CollectionConfig = {
	slug: "maps",
	admin: {
		useAsTitle: "title",
	},
	defaultPopulate: {
		title: true,
		slug: true,
		releaseDate: true,
	},
	defaultSort: "-releaseDate",
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
			index: true,
			admin: {
				position: "sidebar",
			},
			hooks: {
				beforeValidate: [formatSlug("title")],
			},
		},
		{
			name: "releaseDate",
			label: "Release Date",
			type: "date",
			admin: {
				date: {
					displayFormat: "MMMM dd, yyyy hh:mm a",
					pickerAppearance: "dayAndTime",
				},
			},
			required: true,
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
			required: true,
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
			maxLength: 255,
			required: true,
		},
	],
}
