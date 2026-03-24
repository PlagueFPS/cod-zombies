"use client"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/server/not-found-content"
import { decodeParams } from "@/utils/validation-schemas"

export default function InteractiveMapNotFound() {
	const params = useParams()
	const { id } = decodeParams(params)

	return (
		<div className="mt-20">
			<NotFoundContent resource="Interactive Map" param={id.valueOrUndefined} />
		</div>
	)
}
