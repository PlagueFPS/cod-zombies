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

export interface FilterOption {
	value: string
	label: string
}

export interface FilterGroup {
	label: string
	items: FilterOption[]
}

export function toFilterGroup(label: string, items: FilterOption[]): FilterGroup {
	return {
		label,
		items,
	}
}

interface GridFiltersProps {
	groups: FilterGroup[]
	value: FilterOption[]
	onValueChange: (next: FilterOption[]) => void
	placeholder: string
}

export function GridFilters({ groups, value, onValueChange, placeholder }: GridFiltersProps) {
	const anchor = useComboboxAnchor()

	return (
		<Combobox
			multiple
			autoHighlight
			value={value}
			onValueChange={next => onValueChange(next)}
			items={groups}
		>
			<ComboboxChips ref={anchor} className="w-full max-w-xs">
				<ComboboxValue>
					{(values: FilterOption[]) => (
						<Fragment>
							{values.map(v => (
								<ComboboxChip key={v.value} aria-label={v.label}>
									{v.label}
								</ComboboxChip>
							))}
							<ComboboxChipsInput
								className="text-foreground"
								placeholder={`Filter: ${placeholder}`}
							/>
						</Fragment>
					)}
				</ComboboxValue>
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>No filters found.</ComboboxEmpty>
				<ComboboxList>
					{(group: FilterGroup, index: number) => (
						<ComboboxGroup key={group.label} items={group.items}>
							<ComboboxLabel>{group.label} Filters</ComboboxLabel>
							<ComboboxCollection>
								{(item: FilterOption) => (
									<ComboboxItem key={item.value} value={item}>
										{item.label}
									</ComboboxItem>
								)}
							</ComboboxCollection>
							{index < groups.length - 1 ? <ComboboxSeparator /> : null}
						</ComboboxGroup>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	)
}
