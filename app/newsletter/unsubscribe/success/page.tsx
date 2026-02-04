import type { Metadata } from "next"
import { CheckCircle2 } from "lucide-react"
import { CustomLink } from "@/components/client/custom-link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
	title: "Successfully Unsubscribed",
}

export default function UnsubscribeSuccessPage() {
	return (
		<div className="mx-auto max-w-md px-4 py-12 text-center">
			<div className="mb-4 flex justify-center">
				<CheckCircle2 className="h-16 w-16 text-green-500" />
			</div>
			<h1 className="mb-4 font-bold text-2xl">Successfully Unsubscribed</h1>
			<p className="mb-6 text-muted-foreground">
				You have been successfully unsubscribed from our newsletter. We&apos;re sorry to see you go!
			</p>
			<Button nativeButton={false} variant="outline" render={<CustomLink href="/">Return to Homepage</CustomLink>} className="w-full" />
		</div>
	)
}
