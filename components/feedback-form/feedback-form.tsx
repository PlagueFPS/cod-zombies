"use client"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { Loader2, MessageCircleHeart, Send } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { submitFeedbackForm } from "@/data/actions"
import { cn } from "@/lib/utils"
import { FeedbackFormSchema, type TFeedbackForm } from "@/utils/validation-schemas"

interface FeedbackFormProps extends React.ComponentProps<"button"> {
	className?: string
}

export default function FeedbackForm({ className, ...props }: FeedbackFormProps) {
	const [open, setOpen] = useState(false)
	const [isPending, startTransition] = useTransition()
	const form = useForm<TFeedbackForm>({
		resolver: effectTsResolver(FeedbackFormSchema),
		mode: "onChange",
		defaultValues: {
			feedback: "",
		},
	})

	useEffect(() => {
		const controller = new AbortController()
		const handleKeyPress = (event: KeyboardEvent) => {
			const isInputElement =
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement ||
				event.target instanceof HTMLSelectElement

			if (
				(event.key === "f" || event.key === "F") &&
				!event.shiftKey &&
				!event.ctrlKey &&
				!event.altKey &&
				!event.metaKey &&
				!isInputElement
			) {
				event.preventDefault()
				setOpen(true)
			}
		}

		window.addEventListener("keydown", handleKeyPress, {
			signal: controller.signal,
		})

		return () => {
			controller.abort()
		}
	}, [])

	const onSubmit = (data: TFeedbackForm) => {
		startTransition(async () => {
			const result = await submitFeedbackForm(undefined, { ...data, title: "Feedback Form Submission" })
			if (result.success) {
				startTransition(() => {
					toast.success("Feedback submitted successfully!", {
						description: result.message,
						duration: 5000,
						position: "bottom-right",
					})
					form.reset()
					setOpen(false)
				})
			} else {
				startTransition(() => {
					toast.error("Failed to submit feedback!", {
						description: result.message,
						duration: 5000,
						position: "bottom-right",
					})
				})
			}
		})
	}

	return (
		<div className="flex items-center justify-center">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className={cn("flex gap-2 rounded-sm text-muted-foreground", className)}
						{...props}
					>
						<MessageCircleHeart className="size-5" />
						Feedback
						<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-medium text-muted-foreground opacity-100">
							<span className="text-xs">F</span>
						</kbd>
					</Button>
				</DialogTrigger>
				<DialogContent className="rounded-lg">
					<DialogHeader>
						<DialogTitle>Feedback Submission</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="space-y-6 pb-4">
								<FormField
									control={form.control}
									name="feedback"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Textarea {...field} required placeholder="What can we improve?" className="min-h-24" />
											</FormControl>
											<FormDescription>
												Please provide constructive and actionable feedback to help us improve.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button type="submit" className="mt-4 w-full" disabled={isPending}>
								{isPending ? (
									<div className="flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										Submitting...
									</div>
								) : (
									<div className="flex items-center gap-2">
										<Send className="size-4" />
										<span>Submit Feedback</span>
									</div>
								)}
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
