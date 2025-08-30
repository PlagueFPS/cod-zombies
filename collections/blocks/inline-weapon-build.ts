import type { Block } from "payload"

export const InlineWeaponBuildBlock: Block = {
	slug: "weapon-build",
	interfaceName: "InlineWeaponBuildBlock",
	admin: {
		components: {
			Label: "@/components/admin/inline-block-label",
		},
	},
	fields: [
		{
			name: "weaponBuilds", // name must always match the relationTo value
			label: "Weapon Build",
			type: "relationship",
			relationTo: "weaponBuilds",
			admin: {
				appearance: "drawer",
				description: "Weapon build you want to embed inline.",
			},
			required: true,
		},
	],
}
