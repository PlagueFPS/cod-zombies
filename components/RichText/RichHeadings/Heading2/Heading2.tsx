interface Heading2Props {
  children: string[]
}

export default function Heading2({ children }: Heading2Props) {
  return (
    <h2 className="mt-16 mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">{ children }</h2>
  )
}
