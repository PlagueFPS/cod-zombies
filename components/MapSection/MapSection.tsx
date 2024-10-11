import { capatilize } from "@/utils/functions"

interface MapSectionProps {
  children: React.ReactNode
  category?: string
}

export default function MapSection({ children, category }: MapSectionProps) {
  return (
    <section className="flex flex-col gap-8 justify-center w-full">
      <h2 className="font-extrabold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-gradient">
         { category ? capatilize(category) : "Featured" } Maps
      </h2>
      { children }
    </section>
  )
}