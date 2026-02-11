import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"

interface IGridPaginationLoader {
	pages?: number
}

export function GridPaginationLoader({ pages = 3 }: IGridPaginationLoader) {
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href={`#`}
						aria-disabled
						className={"pointer-events-none opacity-25"}
					/>
				</PaginationItem>
				{Array.from({ length: pages }, (_, page) => (
					<PaginationItem key={`pagination-loader-item-${page + 1}`}>
						<PaginationLink href={`?page=${page + 1}`}>{page + 1}</PaginationLink>
					</PaginationItem>
				))}
				<PaginationItem>
					<PaginationNext href={`#`} aria-disabled className={"pointer-events-none opacity-25"} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}
