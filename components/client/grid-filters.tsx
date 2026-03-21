"use client"
import { Fragment } from "react"
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxCollection,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxSeparator,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox"
import { type ParamKey, useFilterParams } from "@/hooks/use-filter-params"

interface Filter {
	value: string
	label: string
}

interface MainQuestFilters {
	type: "main"
	games: Filter[]
	difficulties: Filter[]
	timeRanges: Filter[]
}

interface SideQuestFilters {
	type: "side"
	maps: Filter[]
	games: Filter[]
}

interface RelicFilters {
	type: "relic"
	maps: Filter[]
	types: Filter[]
}

interface MapsFilters {
	type: "map"
	games: Filter[]
}

interface BestiaryFilters {
	type: "zombie"
	games: Filter[]
	maps: Filter[]
	types: Filter[]
	weaknesses: Filter[]
}

interface Group {
	label: string
	paramKey: ParamKey
	items: FilterOption[]
}

type QuestFiltersProps = (
	| MainQuestFilters
	| SideQuestFilters
	| RelicFilters
	| MapsFilters
	| BestiaryFilters
) & {
	placeholder: string
}

interface FilterOption extends Filter {
	paramKey: ParamKey
}

function toFilterOptions(filters: Filter[], paramKey: ParamKey): FilterOption[] {
	return filters.map(f => ({ ...f, paramKey }))
}

function getFilterItems(props: QuestFiltersProps): Group[] {
	switch (props.type) {
		case "main":
			return [
				{
					label: "Difficulty",
					paramKey: "difficulty",
					items: toFilterOptions(props.difficulties, "difficulty"),
				},
				{
					label: "Completion Time",
					paramKey: "time",
					items: toFilterOptions(props.timeRanges, "time"),
				},
				{ label: "Game", paramKey: "game", items: toFilterOptions(props.games, "game") },
			]
		case "side":
			return [
				{ label: "Game", paramKey: "game", items: toFilterOptions(props.games, "game") },
				{ label: "Map", paramKey: "map", items: toFilterOptions(props.maps, "map") },
			]
		case "relic":
			return [
				{ label: "Type", paramKey: "type", items: toFilterOptions(props.types, "type") },
				{ label: "Map", paramKey: "map", items: toFilterOptions(props.maps, "map") },
			]
		case "map":
			return [{ label: "Game", paramKey: "game", items: toFilterOptions(props.games, "game") }]
		case "zombie":
			return [
				{ label: "Type", paramKey: "type", items: toFilterOptions(props.types, "type") },
				{
					label: "Weakness",
					paramKey: "weakness",
					items: toFilterOptions(props.weaknesses, "weakness"),
				},
				{ label: "Game", paramKey: "game", items: toFilterOptions(props.games, "game") },
				{ label: "Map", paramKey: "map", items: toFilterOptions(props.maps, "map") },
			]
		default:
			return []
	}
}

export function GridFilters(props: QuestFiltersProps) {
	const {
		gameParams,
		mapParams,
		difficultyParams,
		timeParams,
		typeParams,
		weaknessParams,
		createParams,
		updateURLParams,
	} = useFilterParams()
	const anchor = useComboboxAnchor()
	const filterItems = getFilterItems(props)

	const paramsByKey: Record<ParamKey, string[]> = {
		game: gameParams,
		map: mapParams,
		difficulty: difficultyParams,
		time: timeParams,
		type: typeParams,
		weakness: weaknessParams,
	}

	const selectedValue: FilterOption[] = []
	for (const group of filterItems) {
		for (const value of paramsByKey[group.paramKey]) {
			const item = group.items.find(i => i.value === value)
			if (item) selectedValue.push(item)
		}
	}

	function onValueChange(newValue: FilterOption[] | null) {
		const next = newValue ?? []
		const params = createParams()

		// Only clear the params this combobox is responsible for.
		// This keeps the logic maintainable as groups are added/removed.
		for (const group of filterItems) {
			params.delete(group.paramKey)
		}
		params.delete("page")

		for (const item of next) {
			params.append(item.paramKey, item.value)
		}

		updateURLParams(params)
	}

	return (
		<Combobox
			multiple
			autoHighlight
			value={selectedValue}
			onValueChange={onValueChange}
			items={filterItems}
		>
			<ComboboxChips ref={anchor} className="w-full max-w-xs">
				<ComboboxValue>
					{(values: FilterOption[]) => (
						<Fragment>
							{values.map(value => (
								<ComboboxChip key={`${value.paramKey}-${value.value}`} aria-label={value.label}>
									{value.label}
								</ComboboxChip>
							))}
							<ComboboxChipsInput placeholder={`Filter: ${props.placeholder}`} />
						</Fragment>
					)}
				</ComboboxValue>
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>No filters found.</ComboboxEmpty>
				<ComboboxList>
					{(group: Group, index: number) => (
						<ComboboxGroup key={group.paramKey} items={group.items}>
							<ComboboxLabel>{group.label} Filters</ComboboxLabel>
							<ComboboxCollection>
								{(item: FilterOption) => (
									<ComboboxItem key={item.value} value={item}>
										{item.label}
									</ComboboxItem>
								)}
							</ComboboxCollection>
							{index < filterItems.length - 1 ? <ComboboxSeparator /> : null}
						</ComboboxGroup>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	)
}
