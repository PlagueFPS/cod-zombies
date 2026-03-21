"use client"
import { useForm } from "@tanstack/react-form"
import { Cause, Exit } from "effect"
import { CircleAlert, MessageCircleHeart, Send } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Shortcut } from "@/components/client/shortcut"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { submitFeedbackForm } from "@/data/actions"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"
import { StandardFeedbackFormSchema, validateFeedbackForm } from "@/utils/validation-schemas"

interface FeedbackFormProps extends React.ComponentProps<"button"> {
	className?: string
}

export function FeedbackForm({ className, ...props }: FeedbackFormProps) {
	const [open, setOpen] = useState(false)
	const [isPending, startTransition] = useTransition()
	const form = useForm({
		defaultValues: {
			title: "Feedback Form Submission",
			feedback: "",
			email: "",
		},
		validators: {
			// @ts-expect-error - optional email in schema vs required in form defaultValues
			onChange: StandardFeedbackFormSchema,
		},
		onSubmit: ({ value }) => {
			const normalized = { ...value, email: value.email?.trim() || undefined }
			const data = validateFeedbackForm(normalized)

			return Exit.match(data, {
				onFailure: cause => {
					return toast.error("Invalid feedback form data!", {
						description: Cause.pretty(cause),
						duration: 5000,
						position: "bottom-right",
					})
				},
				onSuccess: value => {
					startTransition(async () => {
						const result = await submitFeedbackForm(null, value)
						if (result.success) {
							toast.success("Feedback submitted successfully!", {
								description: result.message,
								duration: 5000,
								position: "bottom-right",
							})
							form.reset()
							setOpen(false)
						} else {
							toast.error("Failed to submit feedback!", {
								description: result.message,
								duration: 5000,
								position: "bottom-right",
							})
						}
					})
				},
			})
		},
	})

	useShortcut("f", () => setOpen(true))

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		form.handleSubmit()
	}

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset()
		}
		setOpen(open)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
			e.preventDefault()
			form.handleSubmit()
		}
	}

	return (
		<div className="flex items-center justify-center">
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogTrigger
					render={<Button variant="outline" size="sm" />}
					className={cn("flex gap-2 rounded-sm text-muted-foreground", className)}
					{...props}
				>
					<MessageCircleHeart className="size-5" />
					Feedback
					<Shortcut shortcuts="F" size="sm" className="hidden lg:inline-flex" />
				</DialogTrigger>
				<DialogContent className="rounded-lg">
					<DialogHeader>
						<DialogTitle>Feedback Submission</DialogTitle>
					</DialogHeader>
					<DialogDescription className="sr-only">
						Submit feedback to help us improve the site.
					</DialogDescription>
					<form id="feedback-form" onSubmit={handleSubmit} className="flex w-full flex-col">
						<div className="space-y-6 pb-4">
							<FieldGroup>
								<form.Field name="email">
									{field => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Email (optional)</FieldLabel>
												<Input
													type="email"
													placeholder="you@example.com"
													id={field.name}
													name={field.name}
													value={field.state.value}
													onChange={e => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													onKeyDown={handleKeyDown}
													aria-invalid={isInvalid}
												/>
												<FieldDescription>
													Email you want to be contacted at in case we need to follow up.
												</FieldDescription>
												{isInvalid && (
													<div className="flex items-center gap-2">
														<CircleAlert className="size-4 text-red-500" />
														<FieldError errors={field.state.meta.errors} />
													</div>
												)}
											</Field>
										)
									}}
								</form.Field>
								<form.Field name="feedback">
									{field => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Message</FieldLabel>
												<Textarea
													required
													placeholder="What can we improve?"
													className="min-h-24"
													value={field.state.value}
													onKeyDown={handleKeyDown}
													onChange={e => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
												/>
												<FieldDescription>
													Please provide as much detail as possible.
												</FieldDescription>
												{isInvalid && (
													<div className="flex items-center gap-2">
														<CircleAlert className="size-4 text-red-500" />
														<FieldError errors={field.state.meta.errors} />
													</div>
												)}
											</Field>
										)
									}}
								</form.Field>
							</FieldGroup>
						</div>
						<div className="mt-4 flex items-center justify-between">
							<Button variant={"destructive"} onClick={() => handleOpenChange(false)}>
								Cancel
							</Button>
							<Tooltip>
								<TooltipTrigger
									render={<Button form="feedback-form" type="submit" disabled={isPending} />}
								>
									{isPending ? (
										<>
											<Spinner />
											Submitting...
										</>
									) : (
										<div className="flex items-center justify-center gap-2 font-medium">
											<Send className="size-4" />
											<span>Submit Feedback</span>
										</div>
									)}
								</TooltipTrigger>
								<TooltipContent side="bottom" sideOffset={6}>
									<div className="flex items-center gap-1">
										<Shortcut shortcuts={["Ctrl", "↩"]} size="sm" />
										<span>to submit feedback</span>
									</div>
								</TooltipContent>
							</Tooltip>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
