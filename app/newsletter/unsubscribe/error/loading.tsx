import { AlertCircle } from "lucide-react"
import { CustomLink } from "@/components/client/custom-link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function UnsubscribeErrorPageLoading() {
	return (
		<div className="mx-auto max-w-md px-4 py-12 text-center">
			<div className="mb-4 flex justify-center">
				<AlertCircle className="h-16 w-16 text-red-500" />
			</div>
			<h1 className="mb-4 text-2xl font-bold">Unsubscribe Failed</h1>
			<Skeleton className="mb-6 h-6 w-1/2" />
			<div className="space-y-4">
				<Button
					nativeButton={false}
					variant="outline"
					render={<CustomLink href="/newsletter/unsubscribe">Try Again</CustomLink>}
					className="w-full"
				/>
				<Button
					nativeButton={false}
					variant="outline"
					render={<CustomLink href="/">Return to Homepage</CustomLink>}
					className="w-full"
				/>
			</div>
		</div>
	)
}
