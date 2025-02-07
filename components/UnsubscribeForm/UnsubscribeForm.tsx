"use client"
import { unsubscribeToNewsletter } from "@/data/actions"
import { customOnError, customOnSuccess } from "@/lib/safe-action"
import { NewsletterFormSchema } from "@/utils/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface IUnsubscribeForm {
  email: string
}

export default function UnsubscribeForm({ email }: IUnsubscribeForm) {
  const { form, action: { isPending, result }, handleSubmitWithAction } = useHookFormAction(unsubscribeToNewsletter, zodResolver(NewsletterFormSchema), {
    formProps: {
      mode: 'onBlur',
      defaultValues: {
        email
      },
    },
    actionProps: {
      onSuccess: ({ data }) => {
        customOnSuccess(data?.success, data?.message)
      },
      onError: ({ error }) => customOnError(error, "Invalid Fields. Failed to submit unsubscribe form.")
    }
  })

  if (result.data?.success) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-2 text-lg font-medium">You've been unsubscribed</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You will no longer receive our emails. If you change your mind, you can always resubscribe.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={ handleSubmitWithAction } className="space-y-4 px-4">
        <FormField 
          control={ form.control }
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  hidden  
                  aria-hidden 
                  className="hidden" 
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <Checkbox id="terms" name="terms" required />
          <Label htmlFor="terms" className="text-sm text-muted-foreground">
            I understand that I may miss important updates by unsubscribing
          </Label>
        </div>
        <Button type="submit" className="w-full mt-4" disabled={ isPending }>
          { isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Unsubscribing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Unsubscribe
            </div>
          )}
        </Button>
      </form>
    </Form>
  )
}
