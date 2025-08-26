import type { CollectionConfig } from "payload"

export const Media: CollectionConfig = {
	slug: "media",
	folders: true,
	defaultPopulate: {
		title: true,
		url: true,
		fileName: true,
		mimeType: true,
		fileSize: true,
	},
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
	upload: {
		mimeTypes: ["image/webp", "image/avif"],
	},
}
