import { CustomLink } from "@/components/client/custom-link"
import NewsletterForm from "@/components/client/newsletter-form"

export default function Newsletter() {
	return (
		<div className="flex flex-col items-center text-center md:items-start md:text-start">
			<div className="text-base">Subscribe to our newsletter</div>
			<p className="mb-2 text-muted-foreground text-sm">
				Stay updated on new releases, important updates, and features.
			</p>
			<NewsletterForm />
			<CustomLink
				prefetch={false}
				href="/newsletter/unsubscribe"
				className="mt-2 text-muted-foreground text-xs underline underline-offset-4 hover:text-foreground hover:no-underline"
			>
				Unsubscribe
			</CustomLink>
		</div>
	)
}
