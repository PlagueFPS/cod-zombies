import type { MapConfig, MapConfigMetadata } from "."
import { Option } from "effect"

export const metadata: MapConfigMetadata = {
	id: "ashes-of-the-damned",
	title: "Ashes of the Damned",
	state: Option.some("Coming Soon"),
	game: "Black Ops 7",
	description: "TBD",
}

export const config: MapConfig = {
	id: "ashes-of-the-damned",
	layers: [],
}
