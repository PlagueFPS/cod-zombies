import type { CollectionConfig } from "payload"
import { Redacted } from "effect"
import { getMapById } from "@/data/maps"
import { env } from "@/env"
import { revalidateCollection } from "./hooks/revalidation"

export const MainQuests: CollectionConfig = {
	slug: "mainQuests",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "isComingSoon", "difficulty", "map", "_status", "updatedAt"],
		livePreview: {
			url: async ({ data, req }) => {
				const map = await getMapById(data.map)
				const path = `/${map?.game.slug}/${map?.slug}`
				return `${req.protocol}//${req.host}/api/draft/live-preview?path=${encodeURIComponent(path)}&secret=${encodeURIComponent(Redacted.value(env.DRAFT_SECRET))}`
			},
		},
	},
	defaultPopulate: {
		title: true,
	},
	versions: {
		drafts: {
			autosave: true,
		},
		maxPerDoc: 3,
	},
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
			index: true,
			unique: true,
			admin: {
				description: "Title of the main quest.",
			},
		},
		{
			name: "isComingSoon",
			type: "checkbox",
			defaultValue: false,
			admin: {
				description:
					"Determines if this quest should show a 'Coming Soon' badge and have the main page not be accessible.",
			},
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
			admin: {
				description: "Difficulty of the main quest.",
			},
		},
		{
			name: "map",
			label: "Map",
			type: "relationship",
			relationTo: "maps",
			required: true,
			unique: true,
			admin: {
				description: "Map this main quest belongs to.",
			},
		},
		{
			name: "content",
			label: "Content",
			type: "richText",
			required: true,
			admin: {
				description: "Contents of the main quest.",
			},
		},
	],
	hooks: {
		afterChange: [revalidateCollection],
	},
}
