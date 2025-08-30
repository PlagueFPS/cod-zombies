import type { Block } from "payload"

export const InlineFieldUpgradeBlock: Block = {
	slug: "field-upgrade",
	interfaceName: "InlineFieldUpgradeBlock",
	admin: {
		components: {
			Label: "@/components/admin/inline-block-label",
		},
	},
	fields: [
		{
			name: "fieldUpgrades", // name must always match the relationTo value
			label: "Field Upgrade",
			type: "relationship",
			relationTo: "fieldUpgrades",
			admin: {
				appearance: "drawer",
				description: "Field upgrade you want to embed inline.",
			},
			required: true,
		},
	],
}
