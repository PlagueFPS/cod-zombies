"use client"
import { Predicate } from "effect"
import { useParams } from "next/navigation"
import { capatilize } from "@/utils/functions"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"

export default function BestiaryBreadcrumbsLoader() {
	const { slug } = useParams()
	return (
		<Breadcrumbs
			links={[
				{ title: `Bestiary`, href: `/bestiary` },
				{ title: Predicate.isString(slug) ? capatilize(slug) : "", href: `/bestiary/${slug}` },
			]}
		/>
	)
}
