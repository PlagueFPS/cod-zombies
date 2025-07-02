import NotFoundBreadcrumbs from "@/components/not-found/not-found-breadcrumbs"
import { capatilize } from "@/utils/functions"
import { CustomLink } from "../custom-link/custom-link"
import { Button } from "../ui/button"

interface INotFoundContent {
	param?: string
	pathname?: string
	resource: string
	items?: {
		href: string
		title: string
	}[]
}

export default function NotFoundContent({ resource, items, pathname, param }: INotFoundContent) {
	return (
		<div className="container flex h-full flex-col">
			{items && <NotFoundBreadcrumbs items={items} />}
			<div className="flex h-3/4 grow flex-col items-center justify-center gap-12">
				<div className="flex flex-col items-center justify-center gap-4">
					<h1 className="dark:dark-text-gradient font-extrabold text-2xl text-gradient tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
						{resource} could not be found
					</h1>
					<p className="text-sm md:text-base lg:text-lg">
						The requested {resource}
						<span className="mx-1 font-bold text-primary-gradient">
							{param ? capatilize(param) : pathname ? pathname : null}
						</span>
						does not exist or could not be found
					</p>
				</div>
				<NotFoundButtons items={items} />
			</div>
		</div>
	)
}

const NotFoundButtons = ({ items }: Omit<INotFoundContent, "param" | "resource">) => {
	const newItems = items ? items.slice(0, -1) : []
	return (
		<div className="flex w-fit flex-col items-center justify-between gap-8 sm:flex-row">
			{newItems.length > 0 ? (
				newItems.map(item => (
					<Button key={`${item.title}-${item.href}`} variant={"outline"} asChild>
						<CustomLink href={item.href}>View {item.title}</CustomLink>
					</Button>
				))
			) : (
				<>
					<Button variant={"outline"} asChild>
						<CustomLink href="/">View all Main Quests</CustomLink>
					</Button>
					<Button variant={"outline"} asChild>
						<CustomLink href="/side-quests">View all Side Quests</CustomLink>
					</Button>
				</>
			)}
		</div>
	)
}
