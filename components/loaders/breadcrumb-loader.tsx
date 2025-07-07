"use client"
import { Predicate } from "effect"
import { useParams } from "next/navigation"
import { capitalize } from "@/utils/functions.client"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"

export default function BreadcrumbLoader() {
	const { game, slug } = useParams()

	return (
		<Breadcrumbs
			links={[
				{ title: Predicate.isString(game) ? capitalize(game) : "", href: `/?game=${game}` },
				{ title: Predicate.isString(slug) ? capitalize(slug) : "", href: `/${game}/${slug}` },
			]}
		/>
	)
}
