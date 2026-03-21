"use client"
import type {
	EncodedInteractiveMap,
	EncodedMapEntry,
	EncodedRelic,
	EncodedSideQuest,
	EncodedZombie,
} from "@/utils/rsc-wire"
import { BestiaryCard } from "@/components/client/bestiary-card"
import { MapPreviewCard } from "@/components/client/map-preview-card"
import { QuestPreviewCard } from "@/components/client/quest-preview-card"
import { RelicCard } from "@/components/client/relic-card"
import {
	decodeInteractiveMap,
	decodeMap,
	decodeRelic,
	decodeSideQuest,
	decodeZombie,
	isMapQuest,
} from "@/utils/rsc-wire"

interface HomeQuestPreviewGridProps {
	quests: EncodedMapEntry[] | EncodedSideQuest[]
}

export function HomeQuestPreviewGrid({ quests }: HomeQuestPreviewGridProps) {
	const decodedQuest = (quest: (typeof quests)[number]) =>
		isMapQuest(quest) ? decodeMap(quest) : decodeSideQuest(quest)

	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{quests.map((quest, index) => (
				<QuestPreviewCard key={quest.id} quest={decodedQuest(quest)} questIndex={index} />
			))}
		</div>
	)
}

interface HomeRelicsPreviewGridProps {
	relics: EncodedRelic[]
}

export function HomeRelicsPreviewGrid({ relics }: HomeRelicsPreviewGridProps) {
	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{relics.map((relic, index) => (
				<RelicCard key={relic.id} relic={decodeRelic(relic)} relicIndex={index} />
			))}
		</div>
	)
}

interface HomeBestiaryPreviewGridProps {
	zombies: EncodedZombie[]
}

export function HomeBestiaryPreviewGrid({ zombies }: HomeBestiaryPreviewGridProps) {
	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{zombies.map((zombie, index) => (
				<BestiaryCard key={zombie.id} zombie={decodeZombie(zombie)} zombieIndex={index} />
			))}
		</div>
	)
}

interface HomeMapsPreviewGridProps {
	maps: EncodedInteractiveMap[]
}

export function HomeMapsPreviewGrid({ maps }: HomeMapsPreviewGridProps) {
	return (
		<div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
			{maps.map((map, index) => (
				<MapPreviewCard key={map.id} map={decodeInteractiveMap(map)} index={index} />
			))}
		</div>
	)
}
