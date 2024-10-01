import { cn } from "@/lib/utils"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { connection } from "next/server"

interface CopyrightProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
  className?: string
}

export default async function Copyright({ className }: CopyrightProps) {
  await connection()
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      &copy; { new Date().getFullYear() } Call of Duty: Zombies Guides
    </p>
  )
}
