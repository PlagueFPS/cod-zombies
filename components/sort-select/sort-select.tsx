"use client"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SortOption {
	value: string
	label: string
}

interface SortSelectProps {
	value: string
	options: SortOption[]
	onValueChange: (value: string) => void
	triggerClass?: string
	contentClass?: string
}

export default function SortSelect({
	value,
	options,
	onValueChange,
	triggerClass,
	contentClass,
}: SortSelectProps) {

	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className={cn("w-fit", triggerClass)}>
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
			<SelectContent className={cn(contentClass)}>
				{options.map(option => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
