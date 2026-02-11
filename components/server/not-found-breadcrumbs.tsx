import { Breadcrumbs, type Link } from "@/components/client/breadcrumbs"

interface IBreadcrumbs {
	items: Link<string>[]
}

export function NotFoundBreadcrumbs({ items }: IBreadcrumbs) {
	return <Breadcrumbs links={items} className="ml-4" />
}
