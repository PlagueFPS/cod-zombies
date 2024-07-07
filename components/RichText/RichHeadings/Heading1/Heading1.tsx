interface Heading1Props {
  children: string[]
}

export default function Heading1({ children }: Heading1Props) {
  return (
    <h1 className="mt-16 mb-4 text-4xl font-extrabold">{ children }</h1>
  )
}
