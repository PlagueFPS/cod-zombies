"use client"
import { unsubscribeFromNewsletter } from "@/data/actions"
import { customOnError, customOnSuccess } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2Icon, Send } from "lucide-react"


export default function UnsubscribeForm() {
  const { execute, isPending } = useAction(unsubscribeFromNewsletter, {
    onSuccess: ({ data }) => customOnSuccess(data?.success, data?.message),
    onError: ({ error }) => customOnError(error, "Invalid Fields. Failed to attempt to unsubscribe.")
  })

  return (
    <form action={ execute as never } className="space-y-4 w-full">
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
