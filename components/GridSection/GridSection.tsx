interface MapSectionProps {
  title: string
  children: React.ReactNode
}

export default function GridSection({ title, children }: MapSectionProps) {
  return (
    <section className="flex flex-col gap-8 justify-center w-full">
      <h2 className="font-extrabold text-5xl tracking-tight lg:text-6xl text-gradient">
         { title }
      </h2>
      { children }
    </section>
  )
}