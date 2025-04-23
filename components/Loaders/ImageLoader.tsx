import { cn } from "@/lib/utils"

interface ImageLoaderProps {
  className?: string
}

export default function ImageLoader({ className }: ImageLoaderProps) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center rounded-lg", className)} aria-hidden="true">
      <div className="size-16 border-[6px] border-border border-r-transparent rounded-full animate-spin" />
    </div>
  )
}
