import type { FileRoutesByFullPath } from "@/routeTree.gen"
import { useNavigate, useSearch } from "@tanstack/react-router"
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

type ValidRoutes = keyof Pick<
	FileRoutesByFullPath,
	"/main-quests/" | "/side-quests/" | "/relics/" | "/bestiary/"
>

interface GridSortProps {
	from: ValidRoutes
	options: SortOption[]
	triggerClass?: string
	contentClass?: string
}

export function GridSort({ from, options, triggerClass, contentClass }: GridSortProps) {
	const { sort } = useSearch({ from })
	const navigate = useNavigate({ from })
	const validSortValue = options.find(option => sort === option.value) ?? options.at(0)

	const onValueChange = (value: SortOption | null) => {
		if (!value?.value) return
		void navigate({
			search: prev => ({ ...prev, sort: value.value }),
		})
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
