interface WeakPoint {
	id: string
	title: string
}

export const weakPointsRegistry: Record<string, WeakPoint> = {
	head: {
		id: crypto.randomUUID(),
		title: "Head",
	},
}
