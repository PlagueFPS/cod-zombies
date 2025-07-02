import type { Metadata } from "next"
import type { SearchParams } from "next/dist/server/request/search-params"
import { AlertCircle } from "lucide-react"
import { CustomLink } from "@/components/custom-link/custom-link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
	title: "Unsubscribe Failed",
}

export default async function UnsubscribeErrorPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const { message } = await searchParams
	const errorMessage = decodeURIComponent(String(message)) || "An error occurred during the unsubscribe process."

	return (
		<div className="mx-auto max-w-md px-4 py-12 text-center">
			<div className="mb-4 flex justify-center">
				<AlertCircle className="h-16 w-16 text-red-500" />
			</div>
			<h1 className="mb-4 font-bold text-2xl">Unsubscribe Failed</h1>
			<p className="mb-6 text-muted-foreground">{errorMessage}</p>
			<div className="space-y-4">
				<Button asChild variant="outline" className="w-full">
					<CustomLink href="/newsletter/unsubscribe">Try Again</CustomLink>
				</Button>
				<Button asChild className="w-full">
					<CustomLink href="/">Return to Homepage</CustomLink>
				</Button>
			</div>
		</div>
	)
}
