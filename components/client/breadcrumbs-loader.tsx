"use client"
import type { Route } from "next"

import { useParams } from "next/navigation"

import { Breadcrumbs, type Link } from "@/components/client/breadcrumbs"
import { cn } from "@/lib/utils"
import { capitalize } from "@/utils/shared-functions"

interface IBreadcrumbsLoader {
	type: "main" | "side" | "relic" | "zombie"
	className?: string
}

export function BreadcrumbsLoader({ type, className }: IBreadcrumbsLoader) {
	const { game, map, id } = useParams()

	const getLinks = (): Link<string>[] => {
		switch (type) {
			case "main":
				return [
					{ title: `Main Quests`, href: `/main-quests` },
					{ title: capitalize(String(game)), href: `/main-quests?game=${game}` },
					{ title: capitalize(String(map)), href: `/main-quests/${game}/${map}` as Route },
				]
			case "side":
				return [
					{ title: `Side Quests`, href: `/side-quests` },
					{ title: capitalize(String(game)), href: `/side-quests?game=${game}` },
					{ title: capitalize(String(map)), href: `/side-quests?game=${game}&map=${map}` },
					{ title: capitalize(String(id)), href: `/side-quests/${game}/${map}/${id}` as Route },
				]
			case "relic":
				return [
					{ title: `Relics`, href: `/relics` },
					{ title: capitalize(String(game)), href: `/relics?game=${game}` },
					{ title: capitalize(String(id)), href: `/relics/${game}/${id}` as Route },
				]
			case "zombie":
				return [
					{ title: `Bestiary`, href: `/bestiary` },
					{ title: capitalize(String(id)), href: `/bestiary/${id}` as Route },
				]
			default:
				return []
		}
	}

	return <Breadcrumbs links={getLinks()} className={cn(className)} />
}
