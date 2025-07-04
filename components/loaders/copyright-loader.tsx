import { Skeleton } from "../ui/skeleton"

export default function CopyrightLoader() {
	return (
		<div className="inline-flex items-center text-muted-foreground text-sm">
			&copy; <Skeleton className="mr-1 ml-0.5 h-4 w-9" /> Call of Duty: Zombies Guides
		</div>
	)
}
