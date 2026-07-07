import { EmptyGrid } from "@/components/empty-grid"
import { QuestPreviewCard } from "@/components/quest-preview-card"
import { useIsMobile } from "@/hooks/use-mobile"
import {
	decodeMap,
	decodeSideQuest,
	isMapQuest,
	type EncodedMapEntry,
	type EncodedSideQuest,
} from "@/utils/rsc-wire"

interface IQuestGrid {
	quests: EncodedMapEntry[] | EncodedSideQuest[]
}

export function QuestGrid({ quests }: IQuestGrid) {
	const isMobile = useIsMobile()
	const decodeQuest = (quest: EncodedMapEntry | EncodedSideQuest) => {
		return isMapQuest(quest) ? decodeMap(quest) : decodeSideQuest(quest)
	}

	return (
		<div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{quests.length > 0 ? (
				quests.map((quest, index) => (
					<QuestPreviewCard
						key={quest.id}
						quest={decodeQuest(quest)}
						priority={!isMobile ? index <= 3 : index === 0}
					/>
				))
			) : (
				<EmptyGrid type="Quest" className="col-span-4" />
			)}
		</div>
	)
}
