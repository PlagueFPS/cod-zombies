"use client"
import { useEffect, useState } from "react"
import { customOnError, customOnSuccess } from "@/lib/safe-action"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { submitFeedbackForm } from "@/data/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { FeedbackFormSchema } from "@/utils/validationSchemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
      onSuccess: ({ data }) => {
        customOnSuccess(data?.success, data?.message)
        resetFormAndAction()
        setOpen(false)
      },
      onError: ({ error }) => customOnError(error, "Invalid Fields. Failed to submit feedback")
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
            <DialogTitle>Feedback Form</DialogTitle>
            <DialogDescription>
              We appreciate your feedback. Please fill out the form below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={ handleSubmitWithAction }>
                <div className="space-y-6 pb-4">
                  <FormField 
                    control={ form.control }
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            required 
                            placeholder="Feedback Title" 
                          />
                        </FormControl>
                        <FormDescription>
                          Quests, Experience, Visuals, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ form.control }
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feedback Label</FormLabel>
                        <Select required onValueChange={ field.onChange } defaultValue={ field.value }>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a label" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="featureRequest">Feature Request</SelectItem>
                            <SelectItem value="issue">Issue</SelectItem>
                            <SelectItem value="question">Question</SelectItem>
                            <SelectItem value="idea">Idea</SelectItem>
                            <SelectItem value="complaint">Complaint</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose a label that best describes your feedback.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField 
                    control={ form.control }
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Feedback</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            required
                            placeholder="What can we improve?"
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