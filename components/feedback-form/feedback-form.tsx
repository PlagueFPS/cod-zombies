"use client"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { Loader2, MessageCircleHeart, Send } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { submitFeedbackForm } from "@/data/actions"
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut"
import { cn } from "@/lib/utils"
import { FeedbackFormSchema, type TFeedbackForm } from "@/utils/validation-schemas"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

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
			title: "Feedback Form Submission",
			feedback: "",
		},
	})

	useKeyboardShortcut({
		shortcut: "f",
		callback: () => setOpen(true),
	})

	const onSubmit = (data: TFeedbackForm) => {
		startTransition(async () => {
			const result = await submitFeedbackForm(undefined, data)
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

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter" && form.formState.isValid) {
			e.preventDefault()
			form.handleSubmit(onSubmit)()
		}
	}

	const handleCancel = () => {
		form.reset()
		setOpen(false)
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
					<DialogDescription className="sr-only">
						Submit feedback to help us improve the site.
					</DialogDescription>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col">
							<div className="space-y-6 pb-4">
								<FormField
									control={form.control}
									name="label"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Feedback Label</FormLabel>
											<FormControl>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select a label" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="Bug">Issue</SelectItem>
														<SelectItem value="Improvement">Complaint</SelectItem>
														<SelectItem value="Feature">Feature Request</SelectItem>
														<SelectItem value="User Feedback">Other</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormDescription>
												Select a label that best describes your feedback.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="feedback"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Textarea
													{...field}
													required
													placeholder="What can we improve?"
													className="min-h-24"
													onKeyDown={handleKeyDown}
												/>
											</FormControl>
											<FormDescription>
												Please provide constructive and actionable feedback to help us improve.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="mt-4 flex items-center justify-between">
								<Button variant={"destructive"} onClick={handleCancel}>
									Cancel
								</Button>
								<Button type="submit" disabled={isPending || !form.formState.isValid}>
									{isPending ? (
										<div className="flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											Submitting...
										</div>
									) : (
										<div className="flex items-center justify-center gap-2 font-medium">
											<Send className="size-4" />
											<span>Submit Feedback</span>
											<div className="flex items-center gap-1">
												<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 text-muted-foreground opacity-100">
													<span className="text-xs">Ctrl</span>
												</kbd>
												<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 text-muted-foreground opacity-100">
													<span className="text-xs">↩</span>
												</kbd>
											</div>
										</div>
									)}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
