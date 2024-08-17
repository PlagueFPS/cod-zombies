"use client"
import type { ErrorProps } from "@/types/Error"
import { ErrorButton, ErrorTitle } from "@/components/ui/error"
import { useEffect } from "react"

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <ErrorTitle>Oh no! Something when wrong!</ErrorTitle>
        <ErrorButton onClick={ () => reset() } variant="destructive">
          Try again
        </ErrorButton>
      </body>
    </html>
  )
}
