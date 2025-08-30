import { getAvailableMaps } from "@/data/interactive-map"
import { getMainQuestMetadata } from "@/data/main-quests"
import { getZombiesMetadata } from "@/data/zombies"
import SearchInput from "./search-input"

interface ISearchBar {
	showFull?: boolean
}

export default async function SearchBar({ showFull }: ISearchBar) {
	const mainQuestsPromise = getMainQuestMetadata()
	const zombiesPromise = getZombiesMetadata()

	const [mainQuests, zombies] = await Promise.all([mainQuestsPromise, zombiesPromise])
	const availableMaps = getAvailableMaps()

	return (
		<div className="flex w-fit animate-fade-in items-center justify-center">
			<SearchInput
				maps={mainQuests}
				games={[]}
				quests={[]}
				zombies={zombies}
				showFull={showFull}
				availableMaps={availableMaps}
			/>
		</div>
	)
}
