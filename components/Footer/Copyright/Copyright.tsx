import { cn } from "@/lib/utils"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { connection } from "next/server"

interface CopyrightProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
  className?: string
}

export default async function Copyright({ className }: CopyrightProps) {
  await connection()
  return (
    <div className={cn("flex flex-col gap-1.5 text-xs text-muted-foreground border-t md:border-none py-4 md:py-0", className)}>
      <p>
        &copy; { new Date().getFullYear() } Call of Duty: Zombies Guides
      </p>
      <p>
        This website is an independent, unofficial Call of Duty: Zombies fan site. It is not affiliated with or endorsed by Activision Blizzard. All trademarks, service marks, trade names, trade dress, product names, and logos appearing on this site are the property of their respective owners.
      </p>
    </div>
  )
}
