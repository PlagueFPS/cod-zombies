"use client"
import { useParams } from "next/navigation"
import { capatilize, TypeGuards } from "@/utils/functions"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"

export default function BestiaryBreadcrumbsLoader() {
	const { slug } = useParams()
	return (
		<Breadcrumbs
			links={[
				{ title: `Bestiary`, href: `/bestiary` },
				{ title: TypeGuards.isString(slug) ? capatilize(slug) : "", href: `/bestiary/${slug}` },
			]}
		/>
	)
}
