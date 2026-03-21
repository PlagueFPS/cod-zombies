import { ChevronDown, ChevronsRightIcon } from "lucide-react"

import { BackToTopButton } from "@/components/client/back-to-top-button"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

export function TableOfContentsLoader() {
	return (
		<>
			<aside className="sticky top-20 z-40 ml-4 hidden h-fit w-85 shrink-0 rounded-lg px-6 xl:block">
				<div className="flex flex-col">
					<div className="mt-4 flex flex-col items-center justify-center">
						<div className="mb-2 flex w-full items-center justify-between">
							<span className="text-sm text-muted-foreground">Guide progress</span>
							<span className="text-xs font-medium">0%</span>
						</div>
						<Progress value={0} className="h-1" />
					</div>
					<div className="flex items-center justify-between border-t pt-2">
						<h3 className="text-sm font-medium text-muted-foreground">CURRENT SECTION</h3>
						<Button variant={"ghost"} size={"sm"} disabled aria-disabled>
							<ChevronDown className="size-4" />
						</Button>
					</div>
					<div className="border-b pb-4">
						<Button
							variant={"ghost"}
							className="w-full justify-start rounded-sm bg-accent font-medium dark:bg-accent/50"
							disabled
							aria-disabled
						>
							{"Introduction"}
						</Button>
					</div>
					<ScrollArea className="grid max-h-[50vh] grid-rows-[1fr] gap-1 overflow-hidden transition-all duration-300">
						<ul className="flex flex-col gap-3 overflow-hidden py-4 pl-1 text-sm font-semibold text-foreground/90">
							{Array.from({ length: 15 }, (_, i) => (
								<li key={`toc-loader-${i + 1}`}>
									<Skeleton className="h-6 w-full" />
								</li>
							))}
						</ul>
					</ScrollArea>
				</div>
				<div className="sticky bottom-0 flex w-full items-center justify-center border-t py-4">
					<BackToTopButton disabled aria-disabled className="mt-4" variant={"outline"} />
				</div>
			</aside>
			<MobileTableOfContentsLoader />
		</>
	)
}

const MobileTableOfContentsLoader = () => {
	return (
		<div className="sticky top-16 z-30 w-full border-b bg-background/90 p-3 backdrop-blur-sm supports-backdrop-filter:bg-background/60 xl:hidden">
			<div className="flex items-center gap-2">
				<ChevronsRightIcon className="size-5 text-muted-foreground" />
				<h3 className="font-bold text-muted-foreground">Introduction</h3>
			</div>
		</div>
	)
}
