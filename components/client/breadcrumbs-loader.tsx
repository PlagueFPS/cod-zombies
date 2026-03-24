"use client"
import type { Route } from "next"
import { Option } from "effect"
import { useParams } from "next/navigation"
import { Breadcrumbs, type Link } from "@/components/client/breadcrumbs"
import { cn } from "@/lib/utils"
import { capitalize } from "@/utils/shared-functions"
import { decodeParams } from "@/utils/validation-schemas"

interface IBreadcrumbsLoader {
	type: "main" | "side" | "relic" | "zombie"
	className?: string
}

export function BreadcrumbsLoader({ type, className }: IBreadcrumbsLoader) {
	const params = useParams()
	const { game, map, id } = decodeParams(params)

	const getLinks = (): Link<string>[] => {
		switch (type) {
			case "main":
				return [
					{ title: `Main Quests`, href: `/main-quests` },
					{
						title: Option.match(game, {
							onNone: () => "Game Not Found",
							onSome: game => capitalize(game),
						}),
						href: `/main-quests?game=${game.valueOrUndefined}`,
					},
					{
						title: Option.match(map, {
							onNone: () => "Map Not Found",
							onSome: map => capitalize(map),
						}),
						href: `/main-quests/${game.valueOrUndefined}/${map.valueOrUndefined}` as Route,
					},
				]
			case "side":
				return [
					{ title: `Side Quests`, href: `/side-quests` },
					{
						title: Option.match(game, {
							onNone: () => "Game Not Found",
							onSome: game => capitalize(game),
						}),
						href: `/side-quests?game=${game.valueOrUndefined}`,
					},
					{
						title: Option.match(map, {
							onNone: () => "Map Not Found",
							onSome: map => capitalize(map),
						}),
						href: `/side-quests?game=${game.valueOrUndefined}&map=${map.valueOrUndefined}`,
					},
					{
						title: Option.match(id, {
							onNone: () => "Side Quest Not Found",
							onSome: id => capitalize(id),
						}),
						href: `/side-quests/${game.valueOrUndefined}/${map.valueOrUndefined}/${id.valueOrUndefined}` as Route,
					},
				]
			case "relic":
				return [
					{ title: `Relics`, href: `/relics` },
					{
						title: Option.match(game, {
							onNone: () => "Game Not Found",
							onSome: game => capitalize(game),
						}),
						href: `/relics?game=${game.valueOrUndefined}`,
					},
					{
						title: Option.match(id, {
							onNone: () => "Relic Not Found",
							onSome: id => capitalize(id),
						}),
						href: `/relics/${game.valueOrUndefined}/${id.valueOrUndefined}` as Route,
					},
				]
			case "zombie":
				return [
					{ title: `Bestiary`, href: `/bestiary` },
					{ title: capitalize(String(id)), href: `/bestiary/${id.valueOrUndefined}` as Route },
				]
			default:
				return []
		}
	}

	return <Breadcrumbs links={getLinks()} className={cn(className)} />
}
