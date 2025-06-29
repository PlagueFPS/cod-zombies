import type { Metadata } from 'next';
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import type { SearchParams } from "next/dist/server/request/search-params"
import { CustomLink } from "@/components/custom-link/custom-link"

export const metadata: Metadata = {
  title: 'Unsubscribe Failed'
}

export default async function UnsubscribeErrorPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { message } = await searchParams
  const errorMessage = decodeURIComponent(String(message)) || "An error occurred during the unsubscribe process."

  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center">
      <div className="flex justify-center mb-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Unsubscribe Failed</h1>
      <p className="mb-6 text-muted-foreground">{ errorMessage }</p>
      <div className="space-y-4">
        <Button asChild variant="outline" className="w-full">
          <CustomLink href="/newsletter/unsubscribe">Try Again</CustomLink>
        </Button>
        <Button asChild className="w-full">
          <CustomLink href="/">Return to Homepage</CustomLink>
        </Button>
      </div>
    </div>
  )
}
