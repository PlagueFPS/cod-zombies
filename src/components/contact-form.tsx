import { useForm } from "@tanstack/react-form"
import { useHotkeys } from "@tanstack/react-hotkeys"
import { useServerFn } from "@tanstack/react-start"
import { CircleAlert, Loader2, Mail, Send } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Shortcut } from "@/components/shortcut"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { submitContactForm } from "@/data/server-functions/email"
import { cn } from "@/lib/utils"
import { StandardContactFormSchema } from "@/utils/validation-schemas"

interface ContactFormProps {
	className?: string
}

export default function ContactForm({ className }: ContactFormProps) {
	const [open, setOpen] = useState(false)
	const [isPending, startTransition] = useTransition()
	const sendContactForm = useServerFn(submitContactForm)
	const form = useForm({
		defaultValues: {
			email: "",
			name: "",
			message: "",
		},
		validators: {
			onBlur: StandardContactFormSchema,
		},
		onSubmit: ({ value }) => {
			startTransition(async () => {
				const result = await sendContactForm({ data: value })

				if (result.success) {
					toast.success("Contact form submitted!", {
						description: result.message,
						duration: 5000,
						position: "bottom-right",
					})
					form.reset()
					setOpen(false)
				} else {
					toast.error("Failed to submit contact form!", {
						description: result.message,
						duration: 5000,
						position: "bottom-right",
					})
				}
			})
		},
	})

	useHotkeys([
		{ hotkey: "C", callback: () => handleOpenChange(!open) },
		{
			hotkey: "Mod+Enter",
			callback: () => form.handleSubmit(),
			options: { enabled: open, conflictBehavior: "allow" },
		},
	])

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		void form.handleSubmit()
	}

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset()
		}
		setOpen(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Tooltip>
				<TooltipTrigger
					render={<Button variant="outline" size="sm" />}
					onClick={() => handleOpenChange(true)}
					className={cn("flex gap-2 rounded-sm text-muted-foreground", className)}
				>
					<Mail className="size-5" />
					Contact Us
				</TooltipTrigger>
				<TooltipContent side="top" sideOffset={6} className="z-999">
					<div className="flex items-center gap-1">
						<Shortcut shortcut="C" size="sm" variant="ghost" />
						<span>to open contact form</span>
					</div>
				</TooltipContent>
			</Tooltip>
			<DialogContent className="rounded-lg">
				<DialogHeader>
					<DialogTitle>Contact Us</DialogTitle>
					<DialogDescription>
						Get in touch with the people behind Call of Duty: Zombies Guides.
					</DialogDescription>
				</DialogHeader>
				<form id="contact-form" onSubmit={handleSubmit} className="flex w-full flex-col">
					<div className="space-y-6 pb-4">
						<FieldGroup>
							<form.Field name="name">
								{field => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Name</FieldLabel>
											<Input
												required
												placeholder="Enter your name"
												type="text"
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={e => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
											/>
											<FieldDescription>Name you want to be addressed by.</FieldDescription>
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
							<form.Field name="email">
								{field => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												required
												type="email"
												placeholder="you@example.com"
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={e => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
											/>
											<FieldDescription>Email you want to be contacted at.</FieldDescription>
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
							<form.Field name="message">
								{field => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Message</FieldLabel>
											<Textarea
												required
												placeholder="Enter your message"
												id={field.name}
												name={field.name}
												value={field.state.value}
												onChange={e => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
											/>
											<FieldDescription>Message you want to send.</FieldDescription>
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
								render={<Button form="contact-form" type="submit" disabled={isPending} />}
							>
								{isPending ? (
									<div className="flex items-center gap-2">
										<Loader2 className="size-4 animate-spin" />
										Sending...
									</div>
								) : (
									<div className="flex items-center gap-2">
										<Send className="size-4" />
										<span>Submit Contact Form</span>
									</div>
								)}
							</TooltipTrigger>
							<TooltipContent side="bottom" sideOffset={6} className="z-999">
								<div className="flex items-center gap-1">
									<Shortcut shortcut="Mod+Enter" size="sm" />
									<span>to submit contact form</span>
								</div>
							</TooltipContent>
						</Tooltip>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
