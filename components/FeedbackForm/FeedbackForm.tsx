"use client"
import { useEffect, useState } from "react"
import { customOnError, customOnSuccess } from "@/lib/utils"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { submitFeedbackForm } from "@/data/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { FeedbackFormSchema } from "@/utils/validation-schemas"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormMessage 
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Loader2, MessageCircleHeart, Send } from "lucide-react"

interface FeedbackFormProps extends React.ComponentProps<"button"> {
  className?: string
}

export default function FeedbackForm({ className, ...props }: FeedbackFormProps) {
  const [open, setOpen] = useState(false)
  const { form, action: { isPending }, handleSubmitWithAction, resetFormAndAction } = useHookFormAction(submitFeedbackForm, zodResolver(FeedbackFormSchema), {
    formProps: {
      mode: 'onChange',
    },
    actionProps: {
      onSuccess: ({ data }: { data: { success: boolean, message: string } }) => {
        customOnSuccess(data?.success, data?.message)
        if (data?.success) { // only reset and close on successful response from server
          resetFormAndAction()
          setOpen(false)
        }
      },
      onError: ({ error }: { error: any }) => customOnError(error, "Invalid Fields. Failed to submit feedback")
    }
  })

  useEffect(() => {
    const controller = new AbortController()
    const handleKeyPress = (event: KeyboardEvent) => {
      const isInputElement = event.target instanceof HTMLInputElement 
        || event.target instanceof HTMLTextAreaElement
        || event.target instanceof HTMLSelectElement

      if (
        (event.key === 'f' || event.key === 'F') && 
        !event.shiftKey && 
        !event.ctrlKey && 
        !event.altKey && 
        !event.metaKey && 
        !isInputElement
      ) {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress, {
      signal: controller.signal
    })

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div className="flex justify-center items-center">
      <Dialog open={ open } onOpenChange={ setOpen }>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className={cn("flex gap-2 rounded-sm text-muted-foreground", className)} {...props}>
            <MessageCircleHeart className="size-5" />
            Feedback
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 px-1.5 rounded bg-muted text-muted-foreground font-medium opacity-100">
              <span className="text-xs">F</span>
            </kbd>
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle>Feedback Submission</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={ handleSubmitWithAction }>
                <div className="space-y-6 pb-4">
                  <FormField 
                    control={ form.control }
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            {...field}
                            required
                            placeholder="What can we improve?"
                            className="min-h-24"
                          />
                        </FormControl>
                        <FormDescription>
                          Please provide constructive and actionable feedback to help us improve.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              <Button type="submit" className="w-full mt-4" disabled={ isPending }>
                { isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="size-4" />
                    <span>Submit Feedback</span>
                  </div>
                ) }
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}