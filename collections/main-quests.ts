import type { CollectionConfig } from "payload"

export const mainQuests: CollectionConfig = {
	slug: "main-quests",
	admin: {
		useAsTitle: "title",
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
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "releaseDate",
			label: "Release Date",
			type: "date",
			required: true,
		},
		{
			name: "isComingSoon",
			type: "checkbox",
			required: true,
		},
		{
			name: "difficulty",
			label: "Difficulty",
			type: "select",
			options: [
				{ label: "Easy", value: "Easy" },
				{ label: "Medium", value: "Medium" },
				{ label: "Hard", value: "Hard" },
			],
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
			type: "text",
			required: true,
		},
		{
			name: "content",
			label: "Content",
			type: "richText",
			required: true,
		},
	],
}
