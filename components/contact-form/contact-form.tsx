"use client"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { CircleAlert, Loader2, Mail, Send } from "lucide-react"
import { type KeyboardEvent, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { submitContactForm } from "@/data/actions"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"
import { ContactFormSchema, type TContactForm } from "@/utils/validation-schemas"
import Shortcut from "../shortcut/shortcut"
import { Button } from "../ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface ContactFormProps {
	className?: string
}

export default function ContactForm({ className }: ContactFormProps) {
	const [open, setOpen] = useState(false)
	const [isPending, startTransition] = useTransition()
	const form = useForm<TContactForm>({
		resolver: effectTsResolver(ContactFormSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			name: "",
			message: "",
		},
	})

	useShortcut("c", () => handleOpenChange(!open))

	const onSubmit = (data: TContactForm) => {
		startTransition(async () => {
			const result = await submitContactForm(undefined, data)
			if (result.success) {
				startTransition(() => {
					toast.success("Contact form submitted!", {
						description: result.message,
						duration: 5000,
						position: "bottom-right",
					})
					form.reset()
					setOpen(false)
				})
			} else {
				startTransition(() => {
					toast.error("Failed to submit contact form!", {
						description: result.message,
						duration: 5000,
						position: "bottom-right",
					})
				})
			}
		})
	}

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset()
		}
		setOpen(open)
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && form.formState.isValid) {
			e.preventDefault()
			form.handleSubmit(onSubmit)()
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleOpenChange(true)}
						className={cn("flex gap-2 rounded-sm text-muted-foreground", className)}
					>
						<Mail className="size-5" />
						Contact Us
					</Button>
				</TooltipTrigger>
				<TooltipContent side="top" sideOffset={6} className="z-999">
					<div className="flex items-center gap-1">
						<Shortcut shortcuts="C" size="sm" variant="ghost" />
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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col">
						<div className="space-y-6 pb-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Enter your name"
												required
												onKeyDown={handleKeyDown}
											/>
										</FormControl>
										<FormDescription>Name you want to be addressed by.</FormDescription>
										<div className="flex items-center gap-2">
											{form.formState.errors.name ? (
												<CircleAlert className="size-4 text-red-500" />
											) : null}
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="email"
												placeholder="you@example.com"
												required
												onKeyDown={handleKeyDown}
											/>
										</FormControl>
										<FormDescription>Email you want to be contacted at.</FormDescription>
										<div className="flex items-center gap-2">
											{form.formState.errors.email ? (
												<CircleAlert className="size-4 text-red-500" />
											) : null}
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Message</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Enter your message"
												required
												onKeyDown={handleKeyDown}
											/>
										</FormControl>
										<FormDescription>Message you want to send to the team.</FormDescription>
										<div className="flex items-center gap-2">
											{form.formState.errors.message ? (
												<CircleAlert className="size-4 text-red-500" />
											) : null}
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>
						<div className="mt-4 flex items-center justify-between">
							<Button variant={"destructive"} onClick={() => handleOpenChange(false)}>
								Cancel
							</Button>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button type="submit" disabled={isPending || !form.formState.isValid}>
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
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom" sideOffset={6} className="z-999">
									<div className="flex items-center gap-1">
										<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 text-muted-foreground opacity-100">
											<span className="text-xs">Ctrl</span>
										</kbd>
										<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 text-muted-foreground opacity-100">
											<span className="text-xs">↩</span>
										</kbd>
										<span>to submit contact form</span>
									</div>
								</TooltipContent>
							</Tooltip>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
