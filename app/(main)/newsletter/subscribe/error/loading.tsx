import { CustomLink } from "@/components/custom-link/custom-link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"

export default function SubscribeErrorPageLoading() {
	return (
		<div className="mx-auto max-w-md px-4 py-12 text-center">
			<div className="mb-4 flex justify-center">
				<AlertCircle className="h-16 w-16 text-red-500" />
			</div>
			<h1 className="mb-4 font-bold text-2xl">Subscribe Failed</h1>
			<Skeleton className="mb-6 h-6 w-1/2" />
			<div className="space-y-4">
				<Button asChild variant="outline" className="w-full">
					<CustomLink href="/newsletter/subscribe">Try Again</CustomLink>
				</Button>
				<Button asChild className="w-full">
					<CustomLink href="/">Return to Homepage</CustomLink>
				</Button>
			</div>
		</div>
	)
}
