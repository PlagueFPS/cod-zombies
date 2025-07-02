"use client"
import { usePathname } from "next/navigation"
import NotFoundContent from "@/components/not-found/not-found-content"

export default function RootNotFound() {
	const pathname = usePathname()

	return <NotFoundContent resource="Page" pathname={pathname} />
}
