import { draftMode } from "next/headers"
import { Suspense } from "react"
import { getZombies } from "@/data/zombies"
import GridLoader from "../loaders/grid-loader"
import BestiaryGridClient from "./bestiary-grid.client"

export default async function BestiaryGrid() {
	const { isEnabled } = await draftMode()
	const zombies = await getZombies()

	return (
		<Suspense fallback={<GridLoader />}>
			<BestiaryGridClient zombies={zombies} draftMode={isEnabled} />
		</Suspense>
	)
}
