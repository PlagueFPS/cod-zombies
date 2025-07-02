import { Skeleton } from "../ui/skeleton"

export default function PreviewCardLoader() {
	return (
		<div className="flex flex-col items-start justify-center gap-4">
			<Skeleton className="h-59 w-100" />
			<div className="flex flex-col items-start justify-center gap-1">
				<Skeleton className="badge-primary-gradient dark:dark-badge-primary-gradient h-6 w-20" />
				<Skeleton className="h-8 w-40" />
			</div>
		</div>
	)
}
