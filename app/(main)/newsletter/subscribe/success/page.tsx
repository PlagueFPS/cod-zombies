import type { Metadata } from 'next';
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { CustomLink } from "@/components/CustomLink/CustomLink"

export const metadata: Metadata = {
  title: 'Successfully Subscribed'
}

export default function SubscribeSuccessPage() {
  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Successfully Subscribed</h1>
      <p className="mb-6 text-muted-foreground">
        You have been successfully subscribed to our newsletter.
      </p>
      <Button variant={"outline"} asChild>
        <CustomLink href="/">Return to Homepage</CustomLink>
      </Button>
    </div>
  )
}
