"use client"

import { lazy, Suspense } from "react"
import { CustomLink } from "@/components/custom-link"
import { Skeleton } from "@/components/ui/skeleton"

const NewsletterForm = lazy(() =>
	import("@/components/newsletter-form").then(m => ({ default: m.NewsletterForm })),
)
const ContactForm = lazy(() => import("@/components/contact-form"))

function NewsletterFallback() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<Skeleton className="h-4 w-40" />
			<Skeleton className="h-10 w-full" />
		</div>
	)
}

function ContactFallback() {
	return <Skeleton className="size-9 rounded-md" />
}

export function LazyNewsletter() {
	return (
		<div className="flex flex-col items-center text-center md:items-start md:text-start">
			<div className="text-base">Subscribe to our newsletter</div>
			<p className="mb-2 text-sm text-muted-foreground">
				Stay updated on new releases, important updates, and features.
			</p>
			<Suspense fallback={<NewsletterFallback />}>
				<NewsletterForm />
			</Suspense>
			<CustomLink
				to="/newsletter/unsubscribe"
				className="mt-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground hover:no-underline"
			>
				Unsubscribe
			</CustomLink>
		</div>
	)
}

export function LazyContactForm({ className }: { className?: string }) {
	return (
		<Suspense fallback={<ContactFallback />}>
			<ContactForm className={className} />
		</Suspense>
	)
}
