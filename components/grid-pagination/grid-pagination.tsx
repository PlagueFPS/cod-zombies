"use client"
import { Button } from "@/components/ui/button"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { useIsMobile } from "@/hooks/use-mobile"
import { useQuestSearchParams } from "@/hooks/use-quest-search-params"
import { cn } from "@/lib/utils"
import { MAP_LIMIT } from "@/utils/constants"

interface IGridPagination {
	data: unknown[]
}

export default function GridPagination({ data }: IGridPagination) {
	const { page, updatePage } = useQuestSearchParams()
	const isMobile = useIsMobile(640)
	const totalPages = Math.ceil(data.length / MAP_LIMIT)
	const currentPage = page >= 1 ? (page > totalPages ? totalPages : page) : 1
	const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
	const nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1
	const previousDisabled = prevPage === currentPage
	const nextDisabled = nextPage === currentPage || currentPage === totalPages

	const renderPaginationItems = () => {
		const items = []
		const THRESHOLD = !isMobile ? 7 : 5
		const SIBLINGS = !isMobile ? 2 : 1

		// Helper function to add page button
		const addPageButton = (pageNum: number) => (
			<PaginationItem key={`quest-pagination-item-${pageNum}`}>
				<Button
					size={"icon"}
					variant={currentPage === pageNum ? "outline" : "ghost"}
					aria-current={currentPage === pageNum ? "page" : undefined}
					onClick={() => updatePage(pageNum)}
				>
					{pageNum}
				</Button>
			</PaginationItem>
		)

		// Always add first 5 pages
		items.push(addPageButton(1))

		// If total pages is less than or equal to threshold, show all pages
		if (totalPages <= THRESHOLD) {
			for (let i = 2; i < totalPages; i++) {
				items.push(addPageButton(i))
			}
		} else {
			// Show pages with ellipsis
			const leftSibling = Math.max(currentPage - SIBLINGS, 2)
			const rightSibling = Math.min(currentPage + SIBLINGS, totalPages - 1)

			// Add pages between left and right siblings
			for (let i = leftSibling; i <= rightSibling; i++) {
				items.push(addPageButton(i))
			}
		}

		// Always add last page if it's not the first page
		if (totalPages > 1) {
			items.push(addPageButton(totalPages))
		}

		return items
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationPrevious
					href={`?page=${prevPage}`}
					aria-disabled={previousDisabled}
					className={cn({ "pointer-events-none opacity-25": previousDisabled })}
					tabIndex={previousDisabled ? -1 : 0}
					onNavigate={(e) => {
						e.preventDefault()
						updatePage(prevPage)
					}}
				/>
				{renderPaginationItems()}
				<PaginationNext
					href={`?page=${nextPage}`}
					aria-disabled={nextDisabled}
					className={cn({ "pointer-events-none opacity-25": nextDisabled })}
					tabIndex={nextDisabled ? -1 : 0}
					onNavigate={(e) => {
						e.preventDefault()
						updatePage(nextPage)
					}}
				/>
			</PaginationContent>
		</Pagination>
	)
}
