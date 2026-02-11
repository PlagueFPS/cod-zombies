"use client"
import { useForm } from "@tanstack/react-form"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
			label: "",
			feedback: "",
		},
		validators: {
			onChange: StandardFeedbackFormSchema,
		},
		onSubmit: ({ value }) => {
			const data = validateFeedbackForm(value)

			if (data._tag === "Left") {
				return toast.error("Invalid feedback form data!", {
					description: data.left.message,
					duration: 5000,
					position: "bottom-right",
				})
			}

			startTransition(async () => {
				const result = await submitFeedbackForm(null, data.right)
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

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter" && form.state.isValid) {
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
								<form.Field name="label">
									{(field) => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Labels</FieldLabel>
												<RadioGroup
													name={field.name}
													value={field.state.value}
													onValueChange={field.handleChange}
												>
													<div className="flex items-center space-x-2">
														<RadioGroupItem id="bug" value="Bug" />
														<FieldLabel htmlFor="bug">Bug</FieldLabel>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem id="improvement" value="Improvement" />
														<FieldLabel htmlFor="improvement">Improvement</FieldLabel>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem id="feature" value="Feature" />
														<FieldLabel htmlFor="feature">Feature Request</FieldLabel>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem id="other" value="User Feedback" />
														<FieldLabel htmlFor="other">Other</FieldLabel>
													</div>
												</RadioGroup>
												<FieldDescription>
													Select what best describes your feedback.
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
									{(field) => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Field data-invalid={isInvalid}>
												<FieldLabel htmlFor={field.name}>Message</FieldLabel>
												<Textarea
													required
													placeholder="What can we improve?"
													className="min-h-24"
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
									render={
										<Button
											form="feedback-form"
											type="submit"
											disabled={isPending || !form.state.isValid || !form.state.isFormValid}
										/>
									}
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
								<TooltipContent side="bottom" sideOffset={6} className="z-999">
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
