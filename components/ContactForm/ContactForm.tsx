"use client"
import { useState } from "react"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { submitContactForm } from "@/data/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { ContactFormSchema } from "@/utils/validationSchemas"
import { customOnError, customOnSuccess } from "@/lib/safe-action"
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Loader2, Mail, Send } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface ContactFormProps {
  className?: string
}

export default function ContactForm({ className }: ContactFormProps) {
  const [open, setOpen] = useState(false)
  const { form, action: { isPending }, handleSubmitWithAction, resetFormAndAction } = useHookFormAction(submitContactForm, zodResolver(ContactFormSchema), {
    formProps: {
      mode: 'onBlur',
    },
    actionProps: {
      onSuccess: ({ data }) => {
        customOnSuccess(data?.success, data?.message)
        resetFormAndAction()
        setOpen(false)
      },
      onError: ({ error }) => customOnError(error, "Invalid Fields. Failed to submit contact form.")
    }
  })

  return (
    <Dialog open={ open } onOpenChange={ setOpen }>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn("flex gap-2 rounded-sm text-muted-foreground", className)}>
          <Mail className="size-5" />
          Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Get in touch with the people behind Call of Duty: Zombies Guides.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={ handleSubmitWithAction }>
            <div className="space-y-6 pb-4">
              <FormField
                control={ form.control }
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your name"
                        required
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name you want to be addressed by.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={ form.control }
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
                      />
                    </FormControl>
                    <FormDescription>
                      This is the email you want to be contacted at.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={ form.control }
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your message"
                        required
                      />
                    </FormControl>
                    <FormDescription>
                      This is the message you want to send to the team.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full mt-4" disabled={ isPending }>
              { isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="size-4" />
                  Submit Contact Form
                </div>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
