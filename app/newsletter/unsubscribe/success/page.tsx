import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { CustomLink } from "@/components/CustomLink/CustomLink"

export default function UnsubscribeSuccessPage() {
  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Successfully Unsubscribed</h1>
      <p className="mb-6 text-muted-foreground">
        You have been successfully unsubscribed from our newsletter. We're sorry to see you go!
      </p>
      <Button asChild>
        <CustomLink href="/">Return to Homepage</CustomLink>
      </Button>
    </div>
  )
}
