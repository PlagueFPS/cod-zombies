import { Loader2 } from "lucide-react"

export default function InteractiveMapLoader() {
	return (
		<div className="-mt-10 flex h-screen w-full items-center justify-center bg-accent dark:bg-secondary-alternative">
			<div className="flex h-full w-full items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<Loader2 className="size-20 animate-spin text-primary" />
					<span>Loading Interactive Map</span>
				</div>
			</div>
		</div>
	)
}
