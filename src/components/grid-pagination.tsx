import type { FileRoutesByFullPath } from "@/routeTree.gen"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "cn"
import { Match, Array as Arr } from "effect"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

interface IGridPagination {
	from: keyof Pick<
		FileRoutesByFullPath,
		"/main-quests/" | "/side-quests/" | "/bestiary/" | "/relics/"
	>
	page: number
	totalCount: number
	pageSize: number
}

export function GridPagination({ from, page, totalCount, pageSize }: IGridPagination) {
	const navigate = useNavigate({ from })
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
	const currentPage = Math.min(Math.max(page, 1), totalPages)
	const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
	const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1
	const previousDisabled = prevPage === currentPage
	const nextDisabled = nextPage === currentPage || currentPage === totalPages

	const renderPaginationItems = () => {
		const items: React.JSX.Element[] = []

		const addPageButton = (pageNum: number) => (
			<Button
				key={pageNum}
				size="sm"
				variant="outline"
				aria-current={currentPage === pageNum ? "page" : undefined}
				aria-label={`Page ${pageNum}`}
				onClick={() => navigate({ search: prev => ({ ...prev, page: pageNum }) })}
				className={cn("transition-colors", {
					"text-primary": currentPage === pageNum,
				})}
			>
				{pageNum}
			</Button>
		)

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				items.push(addPageButton(i))
			}
		} else {
			items.push(addPageButton(1))

			const middlePages = Match.value(currentPage).pipe(
				Match.when(
					page => page <= 3,
					() => [2, 3, 4],
				),
				Match.when(
					page => page >= totalPages - 2,
					() => [totalPages - 3, totalPages - 2, totalPages - 1],
				),
				Match.orElse(page => [page - 1, page, page + 1]),
			)

			Arr.forEach(middlePages, pageNum => {
				items.push(addPageButton(pageNum))
			})

			items.push(addPageButton(totalPages))
		}

		return items
	}

	return (
		<ButtonGroup className="mx-auto">
			<ButtonGroup>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Previous"
					disabled={previousDisabled}
					aria-disabled={previousDisabled}
					onClick={() => navigate({ search: prev => ({ ...prev, page: prevPage }) })}
				>
					<ArrowLeftIcon />
				</Button>
			</ButtonGroup>
			<ButtonGroup>{renderPaginationItems()}</ButtonGroup>
			<ButtonGroup>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Next"
					disabled={nextDisabled}
					aria-disabled={nextDisabled}
					onClick={() => navigate({ search: prev => ({ ...prev, page: nextPage }) })}
				>
					<ArrowRightIcon />
				</Button>
			</ButtonGroup>
		</ButtonGroup>
	)
}
