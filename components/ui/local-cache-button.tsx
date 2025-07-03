"use client"
import { usePathname } from "next/navigation"
import { useTransition } from "react"
import { purgeLocalCache } from "@/data/actions"
import { Button } from "./button"

export default function LocalCacheButton() {
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()

	const handleClick = () => {
		startTransition(async () => {
			await purgeLocalCache(undefined, { pathname })
		})
	}

	return (
		<Button
			variant={"destructive"}
			onClick={handleClick}
			disabled={isPending}
			aria-disabled={isPending}
			title="Purge Local Cache"
			aria-label="Purge Local Cache"
		>
			Purge Local Cache
		</Button>
	)
}
