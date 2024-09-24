"use client"
import { subscribeToNewsletter } from "@/data/actions"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Loader2 } from "lucide-react"

export default function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeToNewsletter, { success: false })

  useEffect(() => {
    if (state.success) {
      toast.success(state.message, { position: 'bottom-right', duration: 3000 })
    }
    else if (!state.success) {
      toast.error(state.message, { position: 'bottom-right', duration: 3000 })
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
          <Button type="submit" variant={"secondary"} className="absolute right-1 top-1/2 transform -translate-y-1/2 h-[calc(100%-0.5rem)] rounded-sm px-3 text-sm" disabled={ pending }>
            { pending ? (
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
