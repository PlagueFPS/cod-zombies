"use client"
import { cn } from "@/lib/utils"
import { Loader2, Send, ThumbsDown, ThumbsUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { submitFeedbackForm } from "@/data/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { FeedbackFormSchema } from "@/utils/validationSchemas"
import { customOnError, customOnSuccess } from "@/lib/safe-action"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"

export default function GuideFeedback() {
  const [vote, setVote] = useState<"Liked" | "Disliked" | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { form, action: { isPending }, handleSubmitWithAction, resetFormAndAction } = useHookFormAction(submitFeedbackForm, zodResolver(FeedbackFormSchema), {
    formProps: {
      mode: 'onChange',
    },
    actionProps: {
      onSuccess: ({ data }) => {
        customOnSuccess(data?.success, data?.message)
        resetFormAndAction()
        setVote(null)
      },
      onError: ({ error }) => customOnError(error, "Invalid Fields. Failed to submit feedback")
    }
  })

  useEffect(() => {
    if (!textareaRef.current) return

    if (vote) textareaRef.current.focus()
  }, [vote])

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
      <div className={cn("transition-all duration-300 overflow-hidden h-0 opacity-0", {
        'h-40 opacity-100': vote,
      })}>
        <Form {...form}>
          <form onSubmit={ handleSubmitWithAction } className="flex flex-col gap-4 h-full w-full pb-2">
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
                      className="resize-none focus-visible:ring-0"
                      ref={ textareaRef }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center mt-auto">
              <Badge className={cn("w-fit h-6 transition-colors hidden", {
                'inline-flex': vote,
                'badge-new-gradient dark:dark-badge-new-gradient': vote === 'Liked',
                'badge-hard-gradient dark:dark-badge-hard-gradient': vote === 'Disliked',
              })}>{ vote === "Liked" ? "Helpful" : "Not Helpful" }</Badge>
              <Button 
                type="submit" 
                size={"sm"} 
                variant={"outline"} 
                className="w-fit gap-2 self-end ml-auto"
                disabled={ isPending }
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
