"use client"

import { lazy, Suspense, type ComponentProps } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const FeedbackForm = lazy(() =>
	import("@/components/feedback-form").then(m => ({ default: m.FeedbackForm })),
)

interface LazyFeedbackFormProps extends ComponentProps<"button"> {
	className?: string
}

export function LazyFeedbackForm({ className, ...props }: LazyFeedbackFormProps) {
	return (
		<Suspense fallback={<Skeleton className="hidden h-8 w-24 rounded-md lg:block" />}>
			<FeedbackForm className={className} {...props} />
		</Suspense>
	)
}
