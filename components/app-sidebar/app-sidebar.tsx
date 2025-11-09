"use client"
import { ChevronRightIcon, Menu } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { CustomLink } from "@/components/custom-link/custom-link"
import FeedbackForm from "@/components/feedback-form/feedback-form"
import NavLink from "@/components/nav-link/nav-link"
import Socials from "@/components/socials/socials"
import { Button } from "@/components/ui/button"
import DonateButton from "@/components/ui/donate-button"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import Logo from "@/public/logo.webp"
import { ROUTES } from "@/utils/constants"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item"

export default function AppSidebar() {
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger className="xl:hidden" title="Toggle Nav" asChild>
				<Button size={"icon"} variant={"ghost"}>
					<Menu className="size-6 text-muted-foreground" />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col">
				<SheetTitle className="sr-only">Sidebar</SheetTitle>
				<SheetDescription className="sr-only">App sidebar for mobile navigation</SheetDescription>
				<SheetHeader className="w-full border-b pb-4">
					<SheetClose asChild>
						<CustomLink
							href={"/"}
							aria-label="Go to Home Page"
							className="flex items-center justify-center gap-2"
						>
							<Image
								unoptimized
								src={Logo}
								alt="Call of Duty: Zombies Guides Logo"
								className="size-5 rounded"
							/>
							<div className="text-center font-extrabold text-xl">
								<span className="dark:dark-text-gradient text-gradient">COD:</span>
								<span className="text-primary-gradient"> Zombies Guides</span>
							</div>
						</CustomLink>
					</SheetClose>
				</SheetHeader>
				<nav className="flex w-full flex-col items-start gap-4 text-lg">
					{ROUTES.map(route => (
						<Item asChild key={route.id}>
							<NavLink
								href={route.href}
								aria-label={`Go to ${route.title} page`}
								onClick={() => setOpen(false)}
							>
								<ItemMedia variant="icon">
									<route.icon className="size-5 text-orange-400 dark:text-orange-200" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>{route.title}</ItemTitle>
									<ItemDescription>{route.description}</ItemDescription>
								</ItemContent>
								<ItemActions>
									<ChevronRightIcon className="size-4" />
								</ItemActions>
							</NavLink>
						</Item>
					))}
				</nav>
				<SheetFooter className="mt-auto mb-4 flex w-full flex-col items-center justify-center gap-4 border-t">
					<div className="flex w-full items-center justify-evenly gap-3">
						<FeedbackForm />
						<DonateButton />
					</div>
					<Socials className="w-full justify-evenly" />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
