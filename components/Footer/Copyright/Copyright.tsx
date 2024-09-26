import { cn } from "@/lib/utils"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { unstable_noStore } from "next/cache"

interface CopyrightProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
  className?: string
}

export default function Copyright({ className }: CopyrightProps) {
  unstable_noStore()
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      &copy; { new Date().getFullYear() } Call of Duty: Zombies Guides
    </p>
  )
}
