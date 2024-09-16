"use client"
import { cn } from "@/lib/utils"
import { DetailedHTMLProps, HTMLAttributes } from "react"

interface CopyrightProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
  className?: string
}

export default function Copyright({ className }: CopyrightProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      &copy; { new Date().getFullYear() } Call of Duty: Zombies Guides
    </p>
  )
}
