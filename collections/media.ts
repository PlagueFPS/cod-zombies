import type { CollectionConfig } from "payload"

export const Media: CollectionConfig = {
	slug: "media",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["fileName", "mimeType", "fileSize", "updatedAt"],
	},
	access: {
		read: () => true,
	},
	defaultPopulate: {
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
