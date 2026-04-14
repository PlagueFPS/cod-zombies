import { createFileRoute } from "@tanstack/react-router"
import { UnsubscribeForm } from "@/components/unsubscribe-form"

export const Route = createFileRoute("/newsletter/unsubscribe/")({
	head: () => ({
		meta: [{ title: "Newsletter Unsubscribe" }],
	}),
	component: UnsubscribePage,
})

function UnsubscribePage() {
	return (
		<div className="mx-auto max-w-xl px-4 py-12">
			<h1 className="mb-6 text-2xl font-extrabold md:text-3xl lg:text-4xl">
				Unsubscribe from Newsletter
			</h1>
			<p className="mb-6 text-muted-foreground">
				Enter your email address below. We&apos;ll send you a confirmation link to complete the
				unsubscribe process.
			</p>
			<UnsubscribeForm />
		</div>
	)
}
