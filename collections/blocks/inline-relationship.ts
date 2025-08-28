import type { Block } from "payload"

export const InlineRelationshipBlock: Block = {
	slug: "inline-relationship",
	admin: {
		components: {
			Label: "@/components/admin/inline-relationship-label",
		},
	},
	fields: [
		{
			name: "relationship",
			type: "relationship",
			relationTo: [
				"ammoMods",
				"fieldUpgrades",
				"augments",
				"perks",
				"zombies",
				"weaponBuilds",
				"gobblegum",
			],
			admin: {
				appearance: "drawer",
			},
			required: true,
		},
	],
}
