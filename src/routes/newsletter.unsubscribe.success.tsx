import { createFileRoute } from "@tanstack/react-router"
import { CheckCircle2 } from "lucide-react"
import { CustomLink } from "@/components/custom-link"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/newsletter/unsubscribe/success")({
	head: () => ({
		meta: [{ title: "Successfully Unsubscribed" }],
	}),
	component: NewsletterUnsubscribeSuccess,
})

function NewsletterUnsubscribeSuccess() {
	return (
		<div className="mx-auto max-w-md px-4 py-12 text-center">
			<div className="mb-4 flex justify-center">
				<CheckCircle2 className="h-16 w-16 text-green-500" />
			</div>
			<h1 className="mb-4 text-2xl font-bold">Successfully Unsubscribed</h1>
			<p className="mb-6 text-muted-foreground">
				You have been successfully unsubscribed from our newsletter. We&apos;re sorry to see you go!
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
