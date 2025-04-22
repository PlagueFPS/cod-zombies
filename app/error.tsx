"use client"
import type { ErrorProps } from "@/types/Error"
import { ErrorButton, ErrorDescription, ErrorTitle } from "@/components/ui/error"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import FeedbackForm from "@/components/FeedbackForm/FeedbackForm"

export default function RootError({ error, reset }: ErrorProps) {
  const pathname = usePathname()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col justify-center items-center h-[75vh] gap-16">
      <div className="flex flex-col justify-center items-center gap-4 mx-auto">
        <ErrorTitle>Oh no! Something went wrong!</ErrorTitle>
        <ErrorDescription className="text-center">
          An error occured while viewing { pathname === '/' ? "the home page" : pathname }, if you continue to experience this error please use our feedback form to report the issue
        </ErrorDescription>
      </div>
      <div className="flex justify-center items-center gap-4">
        <FeedbackForm />
        <ErrorButton onClick={ () => reset() } variant="destructive">
          Try again
        </ErrorButton>
      </div>
    </div>
  )
}
