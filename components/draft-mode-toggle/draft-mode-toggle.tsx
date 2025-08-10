"use client"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "../ui/button"

export default function DraftModeToggle() {
	const router = useRouter()
	const [isEnabled, setIsEnabled] = useState("false")
	const [isPending, startTransition] = useTransition()

	const handleToggle = () => {
		startTransition(async () => {
			const result = await fetch("/api/draft").then(res => res.text())
			router.refresh()
			startTransition(() => setIsEnabled(result))
		})
	}

	return (
		<Button onClick={handleToggle} variant={"destructive"} disabled={isPending}>
			{isEnabled === "true" ? "Disable" : "Enable"} Draft Mode
		</Button>
	)
}
