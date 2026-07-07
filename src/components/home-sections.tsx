import { GridSection } from "@/components/grid-section"
import {
	HomeBestiaryPreviewGrid,
	HomeMapsPreviewGrid,
	HomeQuestPreviewGrid,
	HomeRelicsPreviewGrid,
} from "@/components/home-preview-grids"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMapsWithMainQuest } from "@/data/maps"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { HOME_PREVIEW_LIMIT } from "@/utils/constants"

export function MainQuestsSection() {
	const quests = getMapsWithMainQuest().slice(0, HOME_PREVIEW_LIMIT)

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
	const quests = getSideQuests().slice(0, HOME_PREVIEW_LIMIT)

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
	const relics = getRelics().slice(0, HOME_PREVIEW_LIMIT)

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
	const zombies = getZombies().slice(0, HOME_PREVIEW_LIMIT)

	return (
		<GridSection title="Bestiary" className="gap-6" viewAllHref="/bestiary">
			<div className="flex flex-col gap-6">
				<p className="-mt-4 text-muted-foreground sm:text-lg">
					Discover the weaknesses, behavior, and strategies for defeating all enemy types within the
					mode.
				</p>
				<HomeBestiaryPreviewGrid zombies={zombies} />
			</div>
		</GridSection>
	)
}

export function MapsSection() {
	const maps = getInteractiveMaps().slice(0, HOME_PREVIEW_LIMIT)

	return (
		<GridSection
			title="Interactive Maps"
			className="gap-6"
			viewAllHref="/maps"
			mobileTitleSize="md"
		>
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
