"use client"
import { useForm } from "@tanstack/react-form"
import { Send } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { unsubscribeFromNewsletter } from "@/data/actions"
import { StandardNewsletterFormSchema } from "@/utils/validation-schemas"

export default function UnsubscribeForm() {
	const [isPending, startTransition] = useTransition()
	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onChangeAsync: StandardNewsletterFormSchema,
			onChangeAsyncDebounceMs: 200,
		},
		onSubmit: ({ value }) => {
			startTransition(async () => {
				const result = await unsubscribeFromNewsletter("", value)
				if (result.success) {
					return startTransition(() => {
						toast.success("Confirmation email sent!", {
							description: result.message,
							duration: 5000,
							position: "bottom-right",
						})
						form.reset()
					})
				}

				startTransition(() => {
					toast.error("Failed to send confirmation email!", {
						description: result.message,
						duration: 5000,
						position: "bottom-right",
					})
					form.reset()
				})
			})
		},
	})

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		void form.handleSubmit()
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && form.state.isValid) {
			e.preventDefault()
			void form.handleSubmit()
		}
	}

	return (
		<form id="unsubscribe-form" onSubmit={handleSubmit} className="w-full space-y-4">
			<div className="space-y-2">
				<FieldGroup>
					<form.Field name="email">
						{field => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name} className="sr-only">
										Email address
									</FieldLabel>
									<Input
										required
										type="email"
										placeholder="you@example.com"
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										onKeyDown={handleKeyDown}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							)
						}}
					</form.Field>
				</FieldGroup>
			</div>
			<Button type="submit" variant={"default"} disabled={isPending} className="w-fit gap-2">
				{isPending ? (
					<>
						<Spinner />
						Sending...
					</>
				) : (
					<>
						<Send className="size-4" />
						<span>Send Unsubscribe Link</span>
					</>
				)}
			</Button>
		</form>
	)
}
