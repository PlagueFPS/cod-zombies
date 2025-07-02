export function UnorderedList({ children }: { children: React.ReactNode }) {
	return <ul className="list-disc rounded-sm bg-accent p-2 dark:bg-accent/20">{children}</ul>
}

export function OrderedList({ children }: { children: React.ReactNode }) {
	return <ol className="list-decimal rounded-sm bg-accent p-2 dark:bg-accent/20">{children}</ol>
}
