import type { Block } from "payload"

export const ToolBlock: Block = {
	slug: "tool",
	interfaceName: "ToolBlock",
	fields: [
		{
			name: "tool",
			label: "Tool",
			type: "select",
			options: [
				{ label: "Gorod Krovi Valve", value: "gorod-krovi-valve" },
				{ label: "Terminus Code Solver", value: "terminus-code-solver" },
				{ label: "Reckoning Code Solver", value: "reckoning-code-solver" },
			],
			admin: {
				description: "Tool you want to embed",
			},
			required: true,
		},
	],
}
