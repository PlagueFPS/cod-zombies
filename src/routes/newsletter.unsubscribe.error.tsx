import { createFileRoute } from "@tanstack/react-router"
import { AlertCircle } from "lucide-react"
import { CustomLink } from "@/components/custom-link"
import { Button } from "@/components/ui/button"
import { StandardErrorPageSchema } from "@/utils/validation-schemas"

export const Route = createFileRoute("/newsletter/unsubscribe/error")({
	ssr: false,
	validateSearch: StandardErrorPageSchema,
	head: () => ({
		meta: [{ title: "Unsubscribe Failed" }],
	}),
	component: UnsubscribeError,
})

function UnsubscribeError() {
	const { message } = Route.useSearch()

	return (
		<div className="mx-auto max-w-md px-4 py-12 text-center">
			<div className="mb-4 flex justify-center">
				<AlertCircle className="h-16 w-16 text-red-500" />
			</div>
			<h1 className="mb-4 text-2xl font-bold">Unsubscribe Failed</h1>
			<p className="mb-6 text-muted-foreground">{message}</p>
			<div className="space-y-4">
				<Button
					nativeButton={false}
					variant="outline"
					render={<CustomLink to="/newsletter/unsubscribe">Try Again</CustomLink>}
					className="w-full"
				/>
				<Button
					nativeButton={false}
					variant="outline"
					render={<CustomLink to="/">Return to Homepage</CustomLink>}
					className="w-full"
				/>
			</div>
		</div>
	)
}
