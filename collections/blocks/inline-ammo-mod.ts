import type { Block } from "payload"

export const InlineAmmoModBlock: Block = {
	slug: "ammo-mod",
	interfaceName: "InlineAmmoModBlock",
	admin: {
		components: {
			Label: "@/components/admin/inline-block-label",
		},
	},
	fields: [
		{
			name: "ammoMods", // name must always match the relationTo value
			label: "Ammo Mod",
			type: "relationship",
			relationTo: "ammoMods",
			admin: {
				appearance: "drawer",
				description: "Ammo mod you want to embed inline.",
			},
			required: true,
		},
	],
}
