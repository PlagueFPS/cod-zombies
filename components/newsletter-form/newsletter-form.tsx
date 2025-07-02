"use client"
import { Loader2 } from "lucide-react"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { subscribeToNewsletter } from "@/data/actions"

export default function NewsletterForm() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, { success: false, message: "" })

	useEffect(() => {
		if (state.message) {
			if (!state.success) {
				toast.error("Failed to send confirmation email!", {
					description: state.message,
					duration: 5000,
					position: "bottom-right",
				})
			} else {
				toast.success("Confirmation email sent!", {
					description: state.message,
					duration: 5000,
					position: "bottom-right",
				})
			}
		}
	}, [state])

	return (
		<form action={action} className="w-full space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email" className="sr-only">
					Email address
				</Label>
				<div className="relative">
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="you@example.com"
						required
						className="rounded-sm pr-28"
					/>
					<Button
						type="submit"
						variant={"secondary"}
						className="-translate-y-1/2 absolute top-1/2 right-1 h-[calc(100%-0.5rem)] transform rounded-sm px-3 text-sm"
						disabled={isPending}
					>
						{isPending ? (
							<div className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Subscribing...
							</div>
						) : (
							"Subscribe"
						)}
					</Button>
				</div>
			</div>
		</form>
	)
}
