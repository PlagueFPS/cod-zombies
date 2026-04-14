import { Breadcrumbs, type Link } from "@/components/breadcrumbs"

interface IBreadcrumbs {
	items: Link[]
}

export function NotFoundBreadcrumbs({ items }: IBreadcrumbs) {
	return <Breadcrumbs links={items} className="ml-4" />
}
