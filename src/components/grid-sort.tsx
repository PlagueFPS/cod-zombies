import type { FileRoutesByFullPath } from "@/routeTree.gen"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { cn } from "cn"
import { Array as Arr, Option, Predicate } from "effect"
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

	const validSortValue = Option.match(
		Arr.findFirst(options, option => sort === option.value),
		{
			onSome: option => option,
			onNone: () => options.at(0),
		},
	)

	const onValueChange = (value: SortOption | null) => {
		if (!(Predicate.isNotNullish(value?.value) && Predicate.isTruthy(value?.value))) return
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
				{Arr.map(options, option => (
					<SelectItem key={option.value} value={option}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
