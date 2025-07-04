"use client"
import { Predicate } from "effect"
import { useParams } from "next/navigation"
import { capatilize } from "@/utils/functions"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"

export default function BreadcrumbLoader() {
	const { game, slug } = useParams()

	return (
		<Breadcrumbs
			links={[
				{ title: Predicate.isString(game) ? capatilize(game) : "", href: `/?game=${game}` },
				{ title: Predicate.isString(slug) ? capatilize(slug) : "", href: `/${game}/${slug}` },
			]}
		/>
	)
}
