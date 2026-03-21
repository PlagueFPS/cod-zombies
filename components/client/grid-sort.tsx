"use client"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useFilterParams } from "@/hooks/use-filter-params"
import { cn } from "@/lib/utils"

export interface SortOption {
	value: string
	label: string
}

interface GridSortProps {
	options: SortOption[]
	triggerClass?: string
	contentClass?: string
}

export function GridSort({ options, triggerClass, contentClass }: GridSortProps) {
	const { sortParam, updateSort } = useFilterParams()
	const validSortValue = options.find(option => sortParam === option.value) ?? options.at(0)

	const onValueChange = (value: SortOption | null) => {
		if (!value?.value) return
		updateSort(value.value)
	}

	return (
		<Select
			value={validSortValue}
			onValueChange={onValueChange}
			itemToStringLabel={(option: SortOption) => option.label}
		>
			<SelectTrigger className={cn("w-full sm:w-72", triggerClass)}>
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
			<SelectContent className={cn(contentClass)}>
				{options.map(option => (
					<SelectItem key={option.value} value={option}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
