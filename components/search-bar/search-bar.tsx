import { getAvailableMaps } from "@/data/interactive-map"
import { getMainQuestMetadata } from "@/data/main-quests"
import SearchInput from "./search-input"

interface ISearchBar {
	showFull?: boolean
}

export default async function SearchBar({ showFull }: ISearchBar) {
	const mainQuests = await getMainQuestMetadata()
	const availableMaps = getAvailableMaps()

	return (
		<div className="flex w-fit animate-fade-in items-center justify-center">
			<SearchInput
				maps={mainQuests}
				games={[]}
				quests={[]}
				zombies={[]}
				showFull={showFull}
				availableMaps={availableMaps}
			/>
		</div>
	)
}
