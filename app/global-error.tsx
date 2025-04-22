"use client"
import type { ErrorProps } from "@/types/Error"
import { ErrorButton, ErrorDescription, ErrorTitle } from "@/components/ui/error"
import { useEffect } from "react"
import { ThemeProvider } from "@/contexts/ThemeProvider"
import FeedbackForm from "@/components/FeedbackForm/FeedbackForm"

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" className="bg-background">
      <body className="flex flex-col min-h-dvh">
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="mt-10 mb-4 grow" role="main">
            <div className="flex flex-col justify-center items-center h-[75vh] gap-16">
              <div className="flex flex-col justify-center items-center gap-4 mx-auto">
                <ErrorTitle>Oh no! Something went wrong!</ErrorTitle>
                <ErrorDescription className="text-center">
                  An error occured while loading, if you continue to experience this error please use our feedback form to report the issue
                </ErrorDescription>
              </div>
              <div className="flex justify-center items-center gap-4">
                <FeedbackForm size="default" variant="outline" />
                <ErrorButton onClick={ () => reset() } variant="destructive">
                  Try again
                </ErrorButton>
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
