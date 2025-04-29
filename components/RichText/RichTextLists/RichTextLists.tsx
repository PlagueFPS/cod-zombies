
export function UnorderedList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="p-4 bg-accent rounded-sm list-disc dark:bg-accent/20">
      { children }
    </ul>
  )
}

export function OrderedList({ children }: { children: React.ReactNode }) {
  return (
    <ol className="p-4 bg-accent rounded-sm list-decimal dark:bg-accent/20">
      { children }
    </ol>
  )
}
