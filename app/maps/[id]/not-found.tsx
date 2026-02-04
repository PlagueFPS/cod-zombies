"use client"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/server/not-found-content"

export default function InteractiveMapNotFound() {
	const { id } = useParams()
	return (
		<div className="mt-20">
			<NotFoundContent resource="Interactive Map" param={String(id)} />
		</div>
	)
}
