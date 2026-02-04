import { PanelLeftClose } from "lucide-react"
import { ShareButton } from "@/components/client/share-button"
import { Socials } from "@/components/server/socials"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function SidebarLoader() {
	return (
		<div className="-mt-10 relative hidden h-screen w-2xs flex-col border border-t-0 bg-background lg:flex">
			<div className="sticky top-0 flex w-full items-center gap-2 border-b p-2">
				<Skeleton className="h-7 w-50" />
				<PanelLeftClose className="ml-auto size-4" />
			</div>
			<div className="flex h-full flex-col items-center gap-4 p-4">
				{Array.from({ length: 12 }, (_, index) => (
					<Skeleton key={`sidebar-loader-${index + 1}`} className="h-10 w-full" />
				))}
			</div>
			<div className="sticky bottom-0 border-t px-2 py-4">
				<Socials className="justify-evenly">
					<Separator orientation="vertical" className="min-h-5" />
					<ShareButton url="" title="Loading..." />
				</Socials>
			</div>
		</div>
	)
}
