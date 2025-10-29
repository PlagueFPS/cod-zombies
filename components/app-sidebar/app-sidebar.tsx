"use client"
import { Menu } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { CustomLink } from "@/components/custom-link/custom-link"
import ExternalLink from "@/components/external-link/external-link"
import NavLink from "@/components/nav-link/nav-link"
import Discord from "@/components/SVGs/DiscordSVG"
import Reddit from "@/components/SVGs/Reddit"
import X from "@/components/SVGs/XSVG"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
import FeedbackForm from "../feedback-form/feedback-form"
import DonateButton from "../ui/donate-button"
import Socials from "../socials/socials"

export default function AppSidebar() {
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger className="xl:hidden" title="Toggle Nav" asChild>
				<Button size={"icon"} variant={"ghost"}>
					<Menu className="size-6 text-muted-foreground" />
				</Button>
			</SheetTrigger>
			<SheetContent className="z-900 flex flex-col">
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
				<nav className="flex w-full flex-col items-start gap-6 pb-4 pl-4 text-lg">
					{ROUTES.map(route => (
						<NavLink
							key={route.id}
							href={route.href}
							aria-label={`Go to ${route.title} page`}
							className="flex items-center justify-center gap-2 transition-all"
							onClick={() => setOpen(false)}
						>
							<route.icon className="size-5 text-orange-400 dark:text-orange-200" />
							<span className="font-medium">{route.title}</span>
						</NavLink>
					))}
				</nav>
				<SheetFooter className="mt-auto mb-4 flex w-full flex-col items-center justify-center gap-4 border-t">
					<div className="flex w-full items-center justify-evenly gap-3">
						<FeedbackForm />
						<DonateButton />
					</div>
					<Socials className="justify-evenly w-full" />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
