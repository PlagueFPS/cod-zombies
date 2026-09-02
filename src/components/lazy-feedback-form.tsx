"use client"

import { cn } from "cn"
import { MessageCircleHeart } from "lucide-react"
import { lazy, Suspense, type ComponentProps } from "react"
import { Shortcut } from "@/components/shortcut"
import { Button } from "@/components/ui/button"

const FeedbackForm = lazy(() =>
	import("@/components/feedback-form").then(m => ({ default: m.FeedbackForm })),
)

interface LazyFeedbackFormProps extends ComponentProps<"button"> {
	className?: string
}

/** Mirrors `FeedbackForm`'s trigger so Suspense does not shift the header. */
function FeedbackFormFallback({ className }: { className?: string }) {
	return (
		<div className="flex items-center justify-center">
			<Button
				variant="outline"
				size="sm"
				tabIndex={-1}
				aria-hidden
				className={cn("pointer-events-none flex gap-2 rounded-sm text-muted-foreground", className)}
			>
				<MessageCircleHeart className="size-5" />
				Feedback
				<Shortcut shortcut="F" size="sm" className="hidden lg:inline-flex" />
			</Button>
		</div>
	)
}

export function LazyFeedbackForm({ className, ...props }: LazyFeedbackFormProps) {
	return (
		<Suspense fallback={<FeedbackFormFallback className={className} />}>
			<FeedbackForm className={className} {...props} />
		</Suspense>
	)
}
