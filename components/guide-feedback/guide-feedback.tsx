"use client"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { Loader2, Send, ThumbsDown, ThumbsUp } from "lucide-react"
import { useEffect, useRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { submitFeedbackForm } from "@/data/actions"
import { cn } from "@/lib/utils"
import { FeedbackFormSchema, type TFeedbackForm } from "@/utils/validation-schemas"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Textarea } from "../ui/textarea"

interface IGuideFeedback {
	guideTitle: string
}

export default function GuideFeedback({ guideTitle }: IGuideFeedback) {
	const [vote, setVote] = useState<"Liked" | "Disliked" | null>(null)
	const [isPending, startTransition] = useTransition()
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)
	const form = useForm<TFeedbackForm>({
		resolver: effectTsResolver(FeedbackFormSchema),
		mode: "onChange",
		defaultValues: {
			title: guideTitle,
			label: "other",
			feedback: "",
		},
	})

	useEffect(() => {
		if (vote && textareaRef.current) {
			const timeout = setTimeout(() => {
				textareaRef.current?.focus()
			}, 300)

			return () => clearTimeout(timeout)
		}
	}, [vote])

	const onSubmit = (data: TFeedbackForm) => {
		startTransition(async () => {
			const result = await submitFeedbackForm(undefined, {
				...data,
				title: guideTitle,
				label: vote === "Disliked" ? "complaint" : "other",
			})
			if (result.success) {
				startTransition(() => {
					toast.success("Guide feedback submitted!", {
						description: result.message,
						duration: 5000,
						position: "bottom-right",
					})
					form.reset()
					setVote(null)
				})
			} else {
				startTransition(() => {
					toast.error("Guide feedback failed!", {
						description: result.message,
						duration: 5000,
						position: "bottom-right",
					})
				})
			}
		})
	}

	return (
		<div
			className={cn(
				"mt-8 w-full max-w-[250px] space-y-2 rounded-2xl border bg-transparent px-4 pt-2 shadow-sm transition-all duration-300 dark:shadow-none",
				{
					"max-w-[350px] rounded-lg": vote,
				},
			)}
		>
			<div className="flex items-center justify-center gap-4">
				<span className="text-foreground/80 text-sm">Was this guide helpful?</span>
				<div className="flex items-center justify-center gap-1">
					<button type="button" onClick={() => setVote(prev => (prev === "Liked" ? null : "Liked"))} className="group">
						<ThumbsUp
							className={cn("group-hover:-rotate-12 group-focus-visible:-rotate-12 size-4 cursor-pointer text-muted-foreground transition-transform duration-300", {
								"text-primary": vote === "Liked",
							})}
						/>
					</button>
					<button type="button" onClick={() => setVote(prev => (prev === "Disliked" ? null : "Disliked"))} className="group">
						<ThumbsDown
							className={cn("group-hover:-rotate-12 group-focus-visible:-rotate-12 size-4 cursor-pointer text-muted-foreground transition-transform duration-300", {
								"text-primary": vote === "Disliked",
							})}
						/>
					</button>
				</div>
			</div>
			<div
				className={cn("max-h-0 transform-gpu overflow-hidden opacity-0 transition-all duration-300 will-change-auto", {
					"max-h-50 opacity-100": vote,
				})}
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full w-full flex-col gap-4 pb-2">
						<FormField
							control={form.control}
							name="feedback"
							render={({ field }) => (
								<FormItem className="h-full">
									<FormControl>
										<Textarea
											{...field}
											required
											placeholder="Your feedback"
											className="min-h-26 resize-none focus-visible:ring-0"
											ref={textareaRef}
											tabIndex={vote ? 0 : -1}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="mt-auto flex items-center">
							<Badge
								className={cn("inline-flex h-6 w-fit transition-colors", {
									"badge-new-gradient dark:dark-badge-new-gradient": vote === "Liked",
									"badge-hard-gradient dark:dark-badge-hard-gradient": vote === "Disliked",
									"badge-primary-gradient dark:dark-badge-primary-gradient": !vote,
								})}
							>
								{vote === "Liked" ? "Helpful" : vote === "Disliked" ? "Not Helpful" : "Undecided"}
							</Badge>
							<Button
								type="submit"
								size={"sm"}
								variant={"outline"}
								className="mr-1 ml-auto w-fit gap-2 self-end"
								disabled={isPending || !form.formState.isValid}
							>
								{isPending ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Sending...
									</>
								) : (
									<>
										<Send className="size-4" />
										Send
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}
