import { createFileRoute } from "@tanstack/react-router"
import { CheckCircle2 } from "lucide-react"
import { CustomLink } from "@/components/custom-link"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/newsletter/subscribe/success")({
	head: () => ({
		meta: [{ title: "Successfully Subscribed" }],
	}),
	component: NewsletterSubscribeSuccess,
})

function NewsletterSubscribeSuccess() {
	return (
		<div className="mx-auto max-w-md px-4 py-12 text-center">
			<div className="mb-4 flex justify-center">
				<CheckCircle2 className="h-16 w-16 text-green-500" />
			</div>
			<h1 className="mb-4 text-2xl font-bold">Successfully Subscribed</h1>
			<p className="mb-6 text-muted-foreground">
				You have been successfully subscribed to our newsletter.
			</p>
			<Button
				nativeButton={false}
				variant="outline"
				render={<CustomLink to="/">Return to Homepage</CustomLink>}
				className="w-full"
			/>
		</div>
	)
}
