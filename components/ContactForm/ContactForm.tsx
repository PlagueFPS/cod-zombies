"use client"
import { useEffect, useState, useActionState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { submitContactForm } from "@/data/actions";
import FormError from "../ui/form-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, { success: false })
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
    <Dialog open={ open } onOpenChange={ setOpen }>
      <DialogTrigger asChild>
        <Button variant="outline">
          Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Form</DialogTitle>
          <DialogDescription>Contact the team behind Call of Duty: Zombies Guides</DialogDescription>
        </DialogHeader>
        <form action={ action } className="flex flex-col gap-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email"
              name="email"
              id="email"
              placeholder="e.g JohnSmith@example.com"
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
          <div className="space-y-1">
            <Label htmlFor="subject">Subject</Label>
            <Select defaultValue="Feedback" name="subject" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a email subject..." aria-describedby="subject-error" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Feedback">Feedback</SelectItem>
                <SelectItem value="Suggestion">Suggestion</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            { state.errors?.subject && (
              <FormError id="subject-error">
                { state.errors.subject.map(error => (
                  <p key={ error }>{ error }</p>
                ))}
              </FormError>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="body">Body</Label>
            <Textarea
              name="body"
              id="body"
              placeholder="Write your message here"
              maxLength={ 1000 }
              aria-describedby="body-error"
              required
            />
            { state.errors?.body && (
              <FormError id="body-error">
                { state.errors.body.map(error => (
                  <p key={ error }>{ error }</p>
                ))}
              </FormError>
            )}
          </div>
          <DialogFooter>
           <DialogClose asChild>
            <Button variant="outline" className="w-fit">
              Cancel
            </Button>
           </DialogClose>
           <Button type="submit" aria-disabled={ pending } disabled={ pending } className="w-fit">
              { pending ? "Submitting..." : "Submit" }
           </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
