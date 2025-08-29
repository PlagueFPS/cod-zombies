import type { Block } from "payload"

export const InlineAugmentBlock: Block = {
	slug: "augment",
	admin: {
		components: {
			Label: "@/components/admin/inline-block-label",
		},
	},
	fields: [
		{
			name: "augments", // name must always match the relationTo value
			label: "Augment",
			type: "relationship",
			relationTo: "augments",
			admin: {
				appearance: "drawer",
				description: "Augment you want to embed inline.",
			},
			required: true,
		},
	],
}
