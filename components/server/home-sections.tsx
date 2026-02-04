import { Effect, Option } from "effect"
import {
	HomeBestiaryPreviewGrid,
	HomeMapsPreviewGrid,
	HomeQuestPreviewGrid,
	HomeRelicsPreviewGrid,
} from "@/components/client/home-preview-grids"
import { GridSection } from "@/components/server/grid-section"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMainQuests } from "@/data/main-quests"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { HOME_PREVIEW_LIMIT } from "@/utils/constants"
import { sortReleaseDateDesc } from "@/utils/shared-functions"

export function MainQuestsSection() {
	const quests = getMainQuests()
		.slice(0, HOME_PREVIEW_LIMIT)
		.map(quest => {
			const { content, state, difficulty, ...rest } = quest
			return {
				...rest,
				state: Option.getOrNull(state),
				difficulty: Option.getOrNull(difficulty),
			}
		})

	return (
		<GridSection title="Main Quests" className="gap-6" viewAllHref="/main-quests">
			<div className="flex flex-col gap-6">
				<p className="-mt-4 text-muted-foreground sm:text-lg">
					Discover the main story told within the mode.
				</p>
				<HomeQuestPreviewGrid quests={quests} />
			</div>
		</GridSection>
	)
}

export function SideQuestsSection() {
	const quests = getSideQuests()
		.slice(0, HOME_PREVIEW_LIMIT)
		.map(quest => {
			const { content, state, ...rest } = quest
			return {
				...rest,
				state: Option.getOrNull(state),
			}
		})

	return (
		<GridSection title="Side Quests" className="gap-6" viewAllHref="/side-quests">
			<div className="flex flex-col gap-6">
				<p className="-mt-4 text-muted-foreground sm:text-lg">
					Discover the hidden secrets and rewards beyond the main story.
				</p>
				<HomeQuestPreviewGrid quests={quests} />
			</div>
		</GridSection>
	)
}

export function RelicsSection() {
	const relics = [...getRelics()]
		.sort((a, b) => sortReleaseDateDesc(a.discoveredDate, b.discoveredDate))
		.slice(0, HOME_PREVIEW_LIMIT)
		.map(({ content, ...rest }) => rest)

	return (
		<GridSection title="Cursed Relics" className="gap-6" viewAllHref="/relics">
			<div className="flex flex-col gap-6">
				<p className="-mt-4 text-muted-foreground sm:text-lg">
					Learn how to unlock all discovered relics hidden within the Cursed mode.
				</p>
				<HomeRelicsPreviewGrid relics={relics} />
			</div>
		</GridSection>
	)
}

export function BestiarySection() {
	const zombies = getZombies()
		.slice(0, HOME_PREVIEW_LIMIT)
		.map(zombie => {
			const { combatStrategy, state, ...rest } = zombie
			return {
				...rest,
				state: Option.getOrNull(state),
			}
		})

	return (
		<GridSection title="Bestiary" className="gap-6" viewAllHref="/bestiary">
			<div className="flex flex-col gap-6">
				<p className="-mt-4 text-muted-foreground sm:text-lg">
					Discover the weaknesses, behavior, and strategies for defeating all enemy types within the mode.
				</p>
				<HomeBestiaryPreviewGrid zombies={zombies} />
			</div>
		</GridSection>
	)
}

export async function MapsSection() {
	const allMaps = await Effect.runPromise(getInteractiveMaps())
	const maps = allMaps
		.slice(0, HOME_PREVIEW_LIMIT)
		.map(m => ({ ...m, state: Option.getOrNull(m.state) }))

	return (
		<GridSection title="Interactive Maps" className="gap-6" viewAllHref="/maps" mobileTitleSize="md">
			<div className="flex flex-col gap-6">
				<p className="-mt-4 text-muted-foreground sm:text-lg">
					Browse our collection of interactive maps showcasing key spawn points, locations, and
					more.
				</p>
				<HomeMapsPreviewGrid maps={maps} />
			</div>
		</GridSection>
	)
}
