"use client"
import { subscribeToNewsletter } from "@/data/actions"
import { useAction } from "next-safe-action/hooks"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Loader2 } from "lucide-react"
import { customOnError, customOnSuccess } from "@/lib/utils"

export default function NewsletterForm() {
  const { execute, isPending } = useAction(subscribeToNewsletter, {
    onSuccess: ({ data }) => customOnSuccess(data?.success, data?.message),
    onError: ({ error }) => customOnError(error, "Invalid Fields. Failed to subscribe to newsletter")
  })

  return (
    <form action={ execute as never } className="space-y-4 w-full">
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
