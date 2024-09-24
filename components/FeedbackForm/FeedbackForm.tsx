"use client"
import { useActionState, useEffect, useState } from "react"
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
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Loader2, MessageCircleHeart } from "lucide-react"

interface FeedbackFormProps {
  className?: string
}

export default function FeedbackForm({ className }: FeedbackFormProps) {
  const [state, action, pending] = useActionState(submitFeedbackForm, { success: false })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state.success) {
      setOpen(false)
      toast.success(state.message)
    }
    else if (!state.success) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Dialog open={ open } onOpenChange={ setOpen }>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className={cn("rounded-sm gap-2 text-muted-foreground", className)}>
            <MessageCircleHeart className="size-5" />
            Feedback
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback Form</DialogTitle>
            <DialogDescription>
              We appreciate your feedback. Please fill out the form below.
            </DialogDescription>
          </DialogHeader>
          <form action={ action } className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a title for your feedback"
                required
                aria-describedby="title-error"
              />
              { state.errors?.title && (
                <FormError id="title-error">
                  { state.errors.title.map(error => (
                    <p key={ error }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="your@email.com"
                type="email"
                aria-describedby="email-error"
              />
              { state.errors?.email && (
                <FormError id="email-error">
                  { state.errors.email.map(error => (
                    <p key={ error }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                aria-describedby="name-error"
              />
              { state.errors?.name && (
                <FormError id="name-error">
                  { state.errors.name.map(error => (
                    <p key={ error }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
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
              { state.errors?.label && (
                <FormError id="label-error">
                  { state.errors.label.map(error => (
                    <p key={ error }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback *</Label>
              <Textarea
                name="feedback"
                id="feedback"
                placeholder="What can we do better?"
                required
                aria-describedby="feedback-error"
              />
              { state.errors?.feedback && (
                <FormError id="feedback-error">
                  { state.errors.feedback.map(error => (
                    <p key={ error }>{ error }</p>
                  ))}
                </FormError>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={ pending }>
              { pending ? (
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