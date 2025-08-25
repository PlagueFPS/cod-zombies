import type { CollectionConfig } from "payload"

export const media: CollectionConfig = {
	slug: "media",
	defaultPopulate: {
		title: true,
		description: true,
		fileName: true,
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
			required: true,
		},
	],
	upload: true,
}
