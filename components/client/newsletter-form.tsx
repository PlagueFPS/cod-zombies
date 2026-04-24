"use client"
import { useForm } from "@tanstack/react-form"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useRef, useTransition } from "react"
import { toast } from "sonner"
import { Shortcut } from "@/components/client/shortcut"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { subscribeToNewsletter } from "@/data/actions"
import { StandardNewsletterFormSchema } from "@/utils/validation-schemas"

export default function NewsletterForm() {
	const [isPending, startTransition] = useTransition()
	const inputRef = useRef<HTMLInputElement>(null)
	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onBlur: StandardNewsletterFormSchema,
		},
		onSubmit: ({ value }) => {
			startTransition(async () => {
				const result = await subscribeToNewsletter("", value)

				if (result.success) {
					toast.success("Confirmation email sent!", {
						description: result.message,
						duration: 5000,
						position: "bottom-center",
					})

					form.reset()
				} else {
					toast.error("Failed to subscribe to newsletter", {
						description: result.message,
						duration: 5000,
						position: "bottom-center",
					})
				}
			})
		},
	})

	useHotkey("Mod+Enter", () => form.handleSubmit(), { target: inputRef })

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		void form.handleSubmit()
	}

	return (
		<form id="newsletter-form" onSubmit={handleSubmit} className="w-full space-y-4">
			<div className="space-y-2">
				<div className="relative">
					<FieldGroup>
						<form.Field name="email">
							{field => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} className="sr-only">
											Email Address
										</FieldLabel>
										<InputGroup>
											<InputGroupInput
												required
												type="email"
												placeholder="you@example.com"
												ref={inputRef}
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={e => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												className="rounded-sm pr-28"
											/>
											<InputGroupAddon align="inline-end">
												<Tooltip>
													<TooltipTrigger
														render={
															<InputGroupButton
																type="submit"
																form="newsletter-form"
																variant="default"
																disabled={isPending}
																aria-disabled={isPending}
															/>
														}
													>
														{isPending ? (
															<>
																<Spinner />
																Subscribing
															</>
														) : (
															"Subscribe"
														)}
													</TooltipTrigger>
													<TooltipContent side="top" sideOffset={6}>
														<div className="flex items-center gap-1">
															<Shortcut shortcut="Mod+Enter" size="sm" />
															<span>to subscribe</span>
														</div>
													</TooltipContent>
												</Tooltip>
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								)
							}}
						</form.Field>
					</FieldGroup>
				</div>
			</div>
		</form>
	)
}
