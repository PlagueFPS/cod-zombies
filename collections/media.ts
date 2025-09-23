import type { CollectionConfig } from "payload"
import { anyone, isAuthenticated } from "./access/access-control"

export const Media: CollectionConfig = {
	slug: "media",
	admin: {
		useAsTitle: "filename",
		enableListViewSelectAPI: true,
		defaultColumns: ["filename", "mimeType", "filesize", "updatedAt"],
		listSearchableFields: ["filename", "title"],
	},
	forceSelect: {
		// These two fields are required for the image to be displayed and should always be selected
		url: true,
		filename: true,
	},
	access: {
		read: anyone,
		create: isAuthenticated,
		update: isAuthenticated,
		delete: isAuthenticated,
	},
	defaultPopulate: {
		title: true,
		description: true,
		url: true,
		filename: true,
		width: true,
		height: true,
	},
	fields: [
		{
			name: "title",
			type: "text",
			index: true,
			required: true,
			admin: {
				description: "Title of the media.",
			},
		},
		{
			name: "description",
			type: "text",
			admin: {
				description: "Used as the caption and alt text for the media.",
			},
		},
	],
	upload: {
		mimeTypes: ["image/webp", "image/avif"],
	},
}
