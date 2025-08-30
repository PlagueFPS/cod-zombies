import type { Block } from "payload"

export const InlineZombiesBlock: Block = {
	slug: "zombie",
	admin: {
		components: {
			Label: "@/components/admin/inline-block-label",
		},
	},
	interfaceName: "InlineZombieBlock",
	fields: [
		{
			name: "zombies", // name must always match the relationTo value
			label: "Zombie",
			type: "relationship",
			relationTo: "zombies",
			admin: {
				appearance: "drawer",
				description: "Zombie you want to embed inline.",
			},
			required: true,
		},
	],
}
