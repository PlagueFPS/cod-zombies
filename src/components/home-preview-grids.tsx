import type { InteractiveMap } from "@/data/interactive-map"
import type { MapEntry } from "@/data/maps"
import type { Relic } from "@/data/relics"
import type { SideQuest } from "@/data/side-quests"
import type { Zombie } from "@/data/zombies"
import { BestiaryCard } from "@/components/bestiary-card"
import { MapPreviewCard } from "@/components/map-preview-card"
import { QuestPreviewCard } from "@/components/quest-preview-card"
import { RelicCard } from "@/components/relic-card"
import { isMapQuest } from "@/utils/rsc-wire"

interface HomeQuestPreviewGridProps {
	quests: MapEntry[] | SideQuest[]
}

export function HomeQuestPreviewGrid({ quests }: HomeQuestPreviewGridProps) {
	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{quests.map((quest, index) => (
				<QuestPreviewCard
					key={quest.id}
					quest={quest}
					/* React 19 SSR auto-preloads every `loading="eager"` image ahead of CSS.
					 * Only the first above-the-fold card should compete on the critical path. */
					priority={index === 0 && isMapQuest(quest)}
					fetchPriority={index === 0 && isMapQuest(quest) ? "high" : undefined}
				/>
			))}
		</div>
	)
}

interface HomeRelicsPreviewGridProps {
	relics: Relic[]
}

export function HomeRelicsPreviewGrid({ relics }: HomeRelicsPreviewGridProps) {
	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{relics.map(relic => (
				<RelicCard key={relic.id} relic={relic} />
			))}
		</div>
	)
}

interface HomeBestiaryPreviewGridProps {
	zombies: Zombie[]
}

export function HomeBestiaryPreviewGrid({ zombies }: HomeBestiaryPreviewGridProps) {
	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{zombies.map(zombie => (
				<BestiaryCard key={zombie.id} zombie={zombie} />
			))}
		</div>
	)
}

interface HomeMapsPreviewGridProps {
	maps: InteractiveMap[]
}

export function HomeMapsPreviewGrid({ maps }: HomeMapsPreviewGridProps) {
	return (
		<div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
			{maps.map(map => (
				<MapPreviewCard key={map.id} map={map} />
			))}
		</div>
	)
}
