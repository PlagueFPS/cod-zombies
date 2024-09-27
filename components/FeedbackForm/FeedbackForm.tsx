"use client"
import { useEffect, useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { customOnError, customOnSuccess } from "@/lib/safe-action"
import { submitFeedbackForm } from "@/data/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import FormError from "../ui/form-error"
import { cn } from "@/lib/utils"
import { Loader2, MessageCircleHeart } from "lucide-react"

interface FeedbackFormProps {
  className?: string
}

export default function FeedbackForm({ className }: FeedbackFormProps) {
  const [open, setOpen] = useState(false)
  const { result, execute, isPending } = useAction(submitFeedbackForm, {
    onSuccess: ({ data }) => customOnSuccess(data?.success, data?.message),
    onError: ({ error }) => customOnError(error, "Invalid Fields. Failed to submit feedback")
  })
  const { data, validationErrors } = result

  useEffect(() => {
    if (data?.success) {
      setOpen(false)
    }
  }, [data])

  return (
    <div className="flex justify-center items-center">
      <Dialog open={ open } onOpenChange={ setOpen }>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className={cn("hidden sm:flex rounded-sm gap-2 text-muted-foreground", className)}>
            <MessageCircleHeart className="size-5" />
            Feedback
          </Button>
        </DialogTrigger>
        <Button variant="ghost" size="icon" className={cn("flex sm:hidden rounded-sm text-muted-foreground", className)} onClick={ () => setOpen(!open) }>
          <MessageCircleHeart className="size-6" />
        </Button>
        <DialogContent className="rounded-lg">
          <DialogHeader>
            <DialogTitle>Feedback Form</DialogTitle>
            <DialogDescription>
              We appreciate your feedback. Please fill out the form below.
            </DialogDescription>
          </DialogHeader>
          <form action={ execute } className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a title for your feedback"
                required
                aria-describedby="title-error"
              />
              { validationErrors?.title?._errors && (
                <FormError id="title-error">
                  { validationErrors.title._errors?.map(error => (
                    <p key={ `title-error-${error}` }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                name="email"
                placeholder="your@email.com"
                type="email"
                aria-describedby="email-error"
              />
              { validationErrors?.email?._errors && (
                <FormError id="email-error">
                  { validationErrors.email._errors?.map(error => (
                    <p key={ `email-error-${error}` }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                aria-describedby="name-error"
              />
              { validationErrors?.name?._errors && (
                <FormError id="name-error">
                  { validationErrors.name._errors?.map(error => (
                    <p key={ `name-error-${error}` }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Select required aria-describedby="label-error" name="label">
                <SelectTrigger>
                  <SelectValue placeholder="Select a label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featureRequest">Feature Request</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              { validationErrors?.label?._errors && (
                <FormError id="label-error">
                  { validationErrors.label._errors?.map(error => (
                    <p key={ `label-error-${error}` }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                name="feedback"
                id="feedback"
                placeholder="What can we do better?"
                required
                aria-describedby="feedback-error"
              />
              { validationErrors?.feedback?._errors && (
                <FormError id="feedback-error">
                  { validationErrors.feedback._errors?.map(error => (
                    <p key={ `feedback-error-${error}` }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={ isPending }>
              { isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </div>
              ) : 'Submit Feedback' }
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}