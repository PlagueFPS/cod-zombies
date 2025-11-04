"use client"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useFilterParams } from "@/hooks/use-filter-params"
import { cn } from "@/lib/utils"
import { MAP_LIMIT } from "@/utils/constants"

interface IGridPagination {
	data: unknown[]
}

export default function GridPagination({ data }: IGridPagination) {
	const { page, updatePage } = useFilterParams()
	const totalPages = Math.ceil(data.length / MAP_LIMIT)
	const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
	const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
	const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1
	const previousDisabled = prevPage === currentPage
	const nextDisabled = nextPage === currentPage || currentPage === totalPages

	const renderPaginationItems = () => {
		const items: React.JSX.Element[] = []

		// Helper function to add page button
		const addPageButton = (pageNum: number) => (
			<Button
				size="sm"
				variant="outline"
				aria-current={currentPage === pageNum ? "page" : undefined}
				aria-label={`Page ${pageNum}`}
				onClick={() => updatePage(pageNum)}
				className={cn("transition-colors", {
					"text-primary": currentPage === pageNum,
				})}
			>
				{pageNum}
			</Button>
		)

		// If total pages is less than or equal to 5, show all pages
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				items.push(addPageButton(i))
			}
		} else {
			// Always show first page
			items.push(addPageButton(1))

			// Calculate middle pages based on current page
			let middlePages: number[] = []
			if (currentPage <= 3) {
				// Near start - show 2,3,4
				middlePages = [2, 3, 4]
			} else if (currentPage >= totalPages - 2) {
				// Near end - show last-3,last-2,last-1
				middlePages = [totalPages - 3, totalPages - 2, totalPages - 1]
			} else {
				// Middle - show currentPage-1, currentPage, currentPage+1
				middlePages = [currentPage - 1, currentPage, currentPage + 1]
			}

			// Add middle pages
			middlePages.forEach(pageNum => {
				items.push(addPageButton(pageNum))
			})

			// Always show last page
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
					onClick={() => updatePage(prevPage)}
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
					onClick={() => updatePage(nextPage)}
				>
					<ArrowRightIcon />
				</Button>
			</ButtonGroup>
		</ButtonGroup>
	)
}
