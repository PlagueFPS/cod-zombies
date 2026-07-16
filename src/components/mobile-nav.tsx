import { MenuIcon } from "lucide-react"
import { CustomLink } from "@/components/custom-link"
import { Image } from "@/components/image"
import { LazyFeedbackForm } from "@/components/lazy-feedback-form"
import { Socials } from "@/components/socials"
import { Button } from "@/components/ui/button"
import DonateButton from "@/components/ui/donate-button"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet"
import { NAV_ROUTES } from "@/utils/nav-routes"

export function MobileNav() {
	return (
		<Sheet>
			<SheetTrigger render={<Button size="icon" variant="ghost" aria-label="Toggle Nav" />}>
				<MenuIcon className="size-6 text-muted-foreground" />
			</SheetTrigger>
			<SheetContent showCloseButton={false}>
				<SheetHeader className="w-full">
					<SheetClose>
						<CustomLink
							to="/"
							aria-label="Go to Home Page"
							className="flex flex-col items-center justify-center gap-2"
						>
							<Image
								unoptimized
								src="/logo.webp"
								height={128}
								width={128}
								alt="Call of Duty: Zombies Guides Logo"
								className="size-10 rounded"
							/>
							<div className="text-center text-2xl font-extrabold">
								<span className="text-gradient dark:dark-text-gradient">COD:</span>
								<span className="text-primary-gradient"> ZG</span>
							</div>
						</CustomLink>
					</SheetClose>
					<Separator className="mx-auto mt-4 w-4/5!" />
				</SheetHeader>
				<nav className="flex w-full flex-col items-center justify-center gap-2 px-6">
					{NAV_ROUTES.map(route => (
						<SheetClose key={route.id} className="w-full">
							<Item>
								<CustomLink
									to={route.href}
									activeProps={{ className: "text-primary" }}
									aria-label={`Navigate to ${route.title} page`}
									className="flex w-full items-center gap-2"
								>
									<ItemContent>
										<ItemTitle className="text-lg text-muted-foreground">{route.title}</ItemTitle>
									</ItemContent>
								</CustomLink>
							</Item>
						</SheetClose>
					))}
				</nav>
				<Separator className="mx-auto mt-auto w-4/5!" />
				<SheetFooter className="mt-0 mb-4 flex w-full flex-col items-center justify-center gap-4">
					<div className="flex w-full items-center justify-evenly gap-3">
						<LazyFeedbackForm />
						<DonateButton />
					</div>
					<Socials className="w-full justify-evenly" />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
