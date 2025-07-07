"use client"
import { Predicate } from "effect"
import { useParams } from "next/navigation"
import { capitalize } from "@/utils/functions.client"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"

export default function BestiaryBreadcrumbsLoader() {
	const { slug } = useParams()
	return (
		<Breadcrumbs
			links={[
				{ title: `Bestiary`, href: `/bestiary` },
				{ title: Predicate.isString(slug) ? capitalize(slug) : "", href: `/bestiary/${slug}` },
			]}
		/>
	)
}
