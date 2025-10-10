"use client"
import type { Route } from "next"
import type { Link } from "@/components/breadcrumbs/breadcrumbs"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/not-found/not-found-content"
import { capitalize } from "@/utils/functions.client"

export default function ZombieNotFound() {
	const { slug } = useParams()
	const items: Link<string>[] = [
		{ href: `/bestiary`, title: "Bestiary" },
		{ href: `/bestiary/${slug}` as Route, title: capitalize(String(slug)) },
	]

	return <NotFoundContent items={items} resource="Zombie" param={String(slug)} />
}
