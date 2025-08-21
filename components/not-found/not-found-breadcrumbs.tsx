import type { Link } from "../breadcrumbs/breadcrumbs"
import Breadcrumbs from "../breadcrumbs/breadcrumbs"

interface IBreadcrumbs {
	items: Link<string>[]
}

export default function NotFoundBreadcrumbs({ items }: IBreadcrumbs) {
	return <Breadcrumbs links={items} className="ml-4" />
}
