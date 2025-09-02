import type { Block } from "payload"

export const YoutubeEmbedBlock: Block = {
	slug: "youtube-embed",
	interfaceName: "YoutubeEmbedBlock",
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
		},
		{
			name: "youtubeLink",
			label: "Youtube Link",
			type: "text",
			required: true,
		},
	],
}
