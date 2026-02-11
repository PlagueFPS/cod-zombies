"use client"

import type { MainQuest, MainQuestDifficulty } from "@/data/main-quests"
import type { Relic } from "@/data/relics"
import type { SideQuest } from "@/data/side-quests"
import type { Zombie } from "@/data/zombies"
import type { MapConfigMetadata } from "@/map-configs"
import type { ContentState } from "@/types/data"
import { Option } from "effect"
import { BestiaryCard } from "@/components/client/bestiary-card"
import { MapPreviewCard } from "@/components/client/map-preview-card"
import { QuestPreviewCard } from "@/components/client/quest-preview-card"
import { RelicCard } from "@/components/client/relic-card"

type SerializedMainQuest = Omit<MainQuest, "content" | "state" | "difficulty"> & {
	state: ContentState | null
	difficulty: MainQuestDifficulty | null
}
type SerializedSideQuest = Omit<SideQuest, "content" | "state"> & { state: ContentState | null }
type SerializedMapMetadata = Omit<MapConfigMetadata, "state"> & { state: ContentState | null }

interface HomeQuestPreviewGridProps {
	quests: SerializedMainQuest[] | SerializedSideQuest[]
}

function isMainQuest(
	quest: SerializedMainQuest | SerializedSideQuest,
): quest is SerializedMainQuest {
	return quest._tag === "MainQuest"
}

export function HomeQuestPreviewGrid({ quests }: HomeQuestPreviewGridProps) {
	const questsWithOption = quests.map(quest => {
		if (isMainQuest(quest)) {
			return {
				...quest,
				state: Option.fromNullable(quest.state),
				difficulty: Option.fromNullable(quest.difficulty),
			}
		}
		return {
			...quest,
			state: Option.fromNullable(quest.state),
		}
	})

	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{questsWithOption.map((quest, index) => (
				<QuestPreviewCard key={quest.id} quest={quest} questIndex={index} />
			))}
		</div>
	)
}

interface HomeRelicsPreviewGridProps {
	relics: Omit<Relic, "content">[]
}

export function HomeRelicsPreviewGrid({ relics }: HomeRelicsPreviewGridProps) {
	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{relics.map((relic, index) => (
				<RelicCard key={relic.id} relic={relic} relicIndex={index} />
			))}
		</div>
	)
}

type SerializedZombie = Omit<Zombie, "combatStrategy" | "state"> & { state: ContentState | null }

interface HomeBestiaryPreviewGridProps {
	zombies: SerializedZombie[]
}

export function HomeBestiaryPreviewGrid({ zombies }: HomeBestiaryPreviewGridProps) {
	const zombiesWithOption = zombies.map(z => ({
		...z,
		state: Option.fromNullable(z.state),
	}))

	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{zombiesWithOption.map((zombie, index) => (
				<BestiaryCard key={zombie.id} zombie={zombie} zombieIndex={index} />
			))}
		</div>
	)
}

interface HomeMapsPreviewGridProps {
	maps: SerializedMapMetadata[]
}

export function HomeMapsPreviewGrid({ maps }: HomeMapsPreviewGridProps) {
	const mapsWithOption = maps.map(m => ({
		...m,
		state: Option.fromNullable(m.state),
	}))

	return (
		<div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
			{mapsWithOption.map((map, index) => (
				<MapPreviewCard key={map.id} map={map} index={index} />
			))}
		</div>
	)
}
