"use client"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export interface SortOption {
	value: string
	label: string
}

interface SortSelectProps {
	value: string
	options: SortOption[]
	onValueChange: (value: string) => void
}

export default function SortSelect({ value, options, onValueChange }: SortSelectProps) {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
			<SelectContent>
				{options.map(option => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
