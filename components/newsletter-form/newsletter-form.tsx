"use client"
import { subscribeToNewsletter } from "@/data/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

export default function NewsletterForm() {
  const [state, action, isPending] = useActionState(subscribeToNewsletter, { success: false, message: ""})

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
        <Label htmlFor="email" className="sr-only">Email address</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="pr-28 rounded-sm"
          />
          <Button type="submit" variant={"secondary"} className="absolute right-1 top-1/2 transform -translate-y-1/2 h-[calc(100%-0.5rem)] rounded-sm px-3 text-sm" disabled={ isPending }>
            { isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </div>
            ) : 'Subscribe' }
          </Button>
        </div>
      </div>
    </form>
  )
}
