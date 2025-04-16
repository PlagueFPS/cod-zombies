import { cn } from "@/lib/utils"

interface MapSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function GridSection({ title, children, className }: MapSectionProps) {
  return (
    <section className={cn("flex flex-col gap-8 justify-center w-full", className)}>
      <h2 className="font-extrabold text-5xl tracking-tight lg:text-6xl text-gradient">
         { title }
      </h2>
      { children }
    </section>
  )
}