import type { Block } from "payload"

export const InlinePerkBlock: Block = {
	slug: "perk",
	admin: {
		components: {
			Label: "@/components/admin/inline-block-label",
		},
	},
	fields: [
		{
			name: "perks", // name must always match the relationTo value
			label: "Perk",
			type: "relationship",
			relationTo: "perks",
			admin: {
				appearance: "drawer",
				description: "Perk you want to embed inline.",
			},
			required: true,
		},
	],
}
