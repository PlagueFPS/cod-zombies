"use client"
import { unsubscribeFromNewsletter } from "@/data/actions"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2Icon, Send } from "lucide-react"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"


export default function UnsubscribeForm() {
  const [state, action, isPending] = useActionState(unsubscribeFromNewsletter, { success: false, message: ""})

  useEffect(() => {
    if (state.message) {
      if (!state.success) {
        toast.error("Failed to send confirmation email!", {
          description: state.message,
          duration: 5000,
          position: 'bottom-right'
        })
      }
      else {
        toast.success("Confirmation email sent!", {
          description: state.message,
          duration: 5000,
          position: 'bottom-right'
        })
      }
    }
  }, [state])

  return (
    <form action={ action } className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input 
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          disabled={ isPending }
        />
      </div>
      <Button type="submit" variant={"default"} disabled={ isPending } className="w-fit gap-2">
        { isPending ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="size-4" />
            <span>Send Unsubscribe Link</span>
          </>
        )}
      </Button>
    </form>
  )
}
