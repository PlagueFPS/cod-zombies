"use client"
import { cn } from "@/lib/utils"
import { Loader2, Send, ThumbsDown, ThumbsUp } from "lucide-react"
import { useEffect, useTransition, useRef, useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { submitFeedbackForm } from "@/data/actions"
import { effectTsResolver } from "@hookform/resolvers/effect-ts"
import { FeedbackFormSchema } from "@/utils/validation-schemas"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { useForm } from "react-hook-form"
import { Schema } from "effect"
import { toast } from "sonner"

interface IGuideFeedback {
  guideTitle: string
}

export default function GuideFeedback({ guideTitle }: IGuideFeedback) {
  const [vote, setVote] = useState<"Liked" | "Disliked" | null>(null)
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const form = useForm<Schema.Schema.Type<typeof FeedbackFormSchema>>({
    resolver: effectTsResolver(FeedbackFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: guideTitle,
      label: "other",
      feedback: ""
    }
  })

  useEffect(() => {
    if (vote && textareaRef.current) {
      const timeout = setTimeout(() => {
        textareaRef.current?.focus()
      }, 300)

      return () => clearTimeout(timeout)
    }
  }, [vote])

  const onSubmit = (data: Schema.Schema.Type<typeof FeedbackFormSchema>) => {
    startTransition(async () => {
      const result = await submitFeedbackForm(undefined, { 
        ...data,
        title: guideTitle,
        label: vote === "Disliked" ? "complaint" : "other"
      })
      if (result.success) {
        startTransition(() => {
          toast.success("Guide feedback submitted!", {
            description: result.message,
            duration: 5000,
            position: 'bottom-right'
          })
          form.reset()
          setVote(null)
        })
      }
      else {
        startTransition(() => {
          toast.error("Guide feedback failed!", {
            description: result.message,
            duration: 5000,
            position: 'bottom-right'
          })
        })
      }
    })
  }

  return (
    <div className={cn('mt-8 shadow-sm dark:shadow-none w-full space-y-2 bg-transparent border rounded-2xl pt-2 px-4 transition-all duration-300 max-w-[250px]', {
      'rounded-lg max-w-[350px]': vote
    })}>
      <div className="flex items-center justify-center gap-4">
        <span className='text-sm text-foreground/80'>Was this guide helpful?</span>
        <div className='flex items-center justify-center gap-1'>
          <ThumbsUp 
            onClick={() => setVote(prev => prev === "Liked" ? null : "Liked")}
            className={cn('size-4 text-muted-foreground transition-transform cursor-pointer hover:-rotate-12', { 
              'text-primary': vote === "Liked"
            })}
          />
          <ThumbsDown 
            onClick={() => setVote(prev => prev === "Disliked" ? null : "Disliked")}
            className={cn('size-4 text-muted-foreground transition-transform cursor-pointer hover:-rotate-12', { 
              'text-primary': vote === "Disliked" 
            })}
          />
        </div>
      </div>
      <div className={cn("transition-all duration-300 overflow-hidden max-h-0 opacity-0 will-change-auto transform-gpu", {
        'max-h-50 opacity-100': vote,
      })}>
        <Form {...form}>
          <form onSubmit={ form.handleSubmit(onSubmit) } className="flex flex-col gap-4 h-full w-full pb-2">
            <FormField 
              control={ form.control }
              name="feedback"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormControl>
                    <Textarea
                      {...field}
                      required
                      placeholder="Your feedback"
                      className="min-h-26 resize-none focus-visible:ring-0"
                      ref={ textareaRef }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center mt-auto">
              <Badge className={cn("inline-flex w-fit h-6 transition-colors", {
                'badge-new-gradient dark:dark-badge-new-gradient': vote === 'Liked',
                'badge-hard-gradient dark:dark-badge-hard-gradient': vote === 'Disliked',
                'badge-primary-gradient dark:dark-badge-primary-gradient': !vote,
              })}>{ vote === "Liked" ? "Helpful" : vote === "Disliked" ? "Not Helpful" : "Undecided" }</Badge>
              <Button 
                type="submit" 
                size={"sm"} 
                variant={"outline"} 
                className="w-fit gap-2 self-end ml-auto mr-1"
                disabled={ isPending || !form.formState.isValid }
              >
                { isPending ? (
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
