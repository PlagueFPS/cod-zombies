import type { CollectionConfig } from "payload"

export const Media: CollectionConfig = {
	slug: "media",
	defaultPopulate: {
		title: true,
		description: true,
		fileName: true,
		mimeType: true,
		fileSize: true,
		url: true,
	},
	folders: true,
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "description",
			type: "text",
		},
	],
	upload: true,
}
