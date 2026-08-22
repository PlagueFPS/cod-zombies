export const DRAVAKAR_SWITCHES = ["left", "middle", "right"] as const

export type DravakarSwitch = (typeof DRAVAKAR_SWITCHES)[number]

export type DravakarSwitchPresses = Partial<Record<DravakarSwitch, number>>

export const DRAVAKAR_SWITCH_LABELS = {
	left: "Left",
	middle: "Middle",
	right: "Right",
} as const satisfies Record<DravakarSwitch, string>

export type DravakarPuzzleQuote = {
	id: string
	quote: string
	presses: DravakarSwitchPresses
}

export const DRAVAKAR_PUZZLE_QUOTES = [
	{
		id: "runner-stars",
		quote: "I remember the runner that travels to stars, while moons and galaxies stay true",
		presses: { middle: 2, right: 3 },
	},
	{
		id: "runner-moon",
		quote:
			"I drift to the runner that travels moons, who borrow from galaxies when stars stay true",
		presses: { left: 3, middle: 2, right: 1 },
	},
	{
		id: "stars-moons",
		quote: "I drift to stars that remember moons, who borrow the runner that travels the galaxy",
		presses: { left: 1, middle: 2, right: 2 },
	},
	{
		id: "galaxies-moons",
		quote: "I remember galaxies that drift to moons, who borrow the runner that travels the stars",
		presses: { left: 2, right: 2 },
	},
] as const satisfies readonly DravakarPuzzleQuote[]

export type DravakarPuzzleQuoteId = (typeof DRAVAKAR_PUZZLE_QUOTES)[number]["id"]

export type DravakarSwitchInteraction = {
	switch: DravakarSwitch
	label: string
	count: number
}

export function formatDravakarSwitchInteractions(
	presses: DravakarSwitchPresses,
): DravakarSwitchInteraction[] {
	return DRAVAKAR_SWITCHES.flatMap(switchName => {
		const count = presses[switchName]
		if (!count) return []

		return [{ switch: switchName, label: DRAVAKAR_SWITCH_LABELS[switchName], count }]
	})
}

export function formatDravakarSwitchSolution(presses: DravakarSwitchPresses): string {
	return formatDravakarSwitchInteractions(presses)
		.map(interaction => `${interaction.label} ${interaction.count}x`)
		.join(", ")
}
