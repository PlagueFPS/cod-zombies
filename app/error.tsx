"use client"
import type { ErrorProps } from "@/types/Error"
import { ErrorButton, ErrorDescription, ErrorTitle } from "@/components/ui/error"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function RootError({ error, reset }: ErrorProps) {
  const pathname = usePathname()

  useEffect(() => {
    console.error(error)
  }, [])

  return (
    <div className="flex flex-col justify-center items-center h-[75vh] gap-16">
      <div className="flex flex-col justify-center items-center gap-4">
        <ErrorTitle>Oh no! Something when wrong!</ErrorTitle>
        <ErrorDescription>
          An error occured while viewing { pathname === '/' ? "the home page" : pathname }, if you continue to experience this error please use our contact form to report the issue
        </ErrorDescription>
      </div>
      <ErrorButton onClick={ () => reset() } variant="destructive">
        Try again
      </ErrorButton>
    </div>
  )
}
