"use client"
import { usePathname } from "next/navigation"

import NotFoundContent from "@/components/server/not-found-content"

export default function RootNotFound() {
	const pathname = usePathname()

	return <NotFoundContent resource="Page" pathname={pathname} />
}
