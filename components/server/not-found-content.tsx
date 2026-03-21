import type { Link } from "@/components/client/breadcrumbs"

import { CustomLink } from "@/components/client/custom-link"
import { NotFoundBreadcrumbs } from "@/components/server/not-found-breadcrumbs"
import { Button } from "@/components/ui/button"
import { capitalize } from "@/utils/shared-functions"

interface INotFoundContent<T extends string> {
	param?: string
	pathname?: string
	resource: string
	items?: Link<T>[]
}

export default function NotFoundContent<T extends string>({
	resource,
	items,
	pathname,
	param,
}: INotFoundContent<T>) {
	return (
		<div className="container flex h-full flex-col gap-8">
			{items && <NotFoundBreadcrumbs items={items} />}
			<div className="flex h-3/4 grow flex-col items-center justify-center gap-12">
				<div className="flex flex-col items-center justify-center gap-4">
					<h1 className="text-gradient text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl dark:dark-text-gradient">
						{resource} could not be found
					</h1>
					<p className="text-sm md:text-base lg:text-lg">
						The requested {resource}
						<span className="mx-1 text-primary-gradient font-bold">
							{param ? capitalize(param) : pathname ? pathname : null}
						</span>
						does not exist or could not be found
					</p>
				</div>
				<NotFoundButtons items={items} />
			</div>
		</div>
	)
}

const NotFoundButtons = <T extends string>({
	items,
}: Omit<INotFoundContent<T>, "param" | "resource">) => {
	const newItems = items ? items.slice(0, -1) : []
	return (
		<div className="flex w-fit flex-col items-center justify-between gap-8 sm:flex-row">
			{newItems.length > 0 ? (
				newItems.map(item => (
					<Button
						nativeButton={false}
						key={`${item.title}-${item.href}`}
						variant={"outline"}
						render={<CustomLink href={item.href}>View {item.title}</CustomLink>}
					/>
				))
			) : (
				<>
					<Button
						nativeButton={false}
						variant={"outline"}
						render={<CustomLink href="/main-quests">View all Main Quests</CustomLink>}
					/>
					<Button
						nativeButton={false}
						variant={"outline"}
						render={<CustomLink href="/side-quests">View all Side Quests</CustomLink>}
					/>
					<Button
						nativeButton={false}
						variant={"outline"}
						render={<CustomLink href="/bestiary">View all Zombies</CustomLink>}
					/>
					<Button
						nativeButton={false}
						variant={"outline"}
						render={<CustomLink href="/relics">View all Cursed Relics</CustomLink>}
					/>
					<Button
						nativeButton={false}
						variant={"outline"}
						render={<CustomLink href="/maps">View all Interactive Maps</CustomLink>}
					/>
				</>
			)}
		</div>
	)
}
