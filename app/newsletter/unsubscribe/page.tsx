import type { Metadata } from "next"
import UnsubscribeForm from "@/components/client/unsubscribe-form"

export const metadata: Metadata = {
	title: "Newsletter Unsubscribe",
}

export default function NewsletterUnsubscribePage() {
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
