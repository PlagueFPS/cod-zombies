"use client"
import { useParams } from "next/navigation"
import NotFoundContent from "@/components/not-found/not-found-content"
import { capitalize } from "@/utils/functions"

export default function QuestNotFound() {
	const { slug } = useParams()
	const items: { href: string; title: string }[] = [
		{ href: `/bestiary`, title: "Bestiary" },
		{ href: `/bestiary/${slug}`, title: capitalize(String(slug)) },
	]

	return <NotFoundContent items={items} resource="Zombie" param={String(slug)} />
}
