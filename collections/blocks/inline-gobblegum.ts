import type { Block } from "payload"

export const InlineGobblegumBlock: Block = {
	slug: "gobblegum",
	admin: {
		components: {
			Label: "@/components/admin/inline-block-label",
		},
	},
	fields: [
		{
			name: "gobblegum", // name must always match the relationTo value
			label: "GobbleGum",
			type: "relationship",
			relationTo: "gobblegum",
			admin: {
				appearance: "drawer",
				description: "GobbleGum you want to embed inline.",
			},
			required: true,
		},
	],
}
