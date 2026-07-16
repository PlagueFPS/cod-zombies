import Copyright from "@/components/copyright"
import { CustomLink } from "@/components/custom-link"
import { LazyContactForm, LazyNewsletter } from "@/components/lazy-footer-widgets"
import { Socials } from "@/components/socials"
import DonateButton from "@/components/ui/donate-button"

export function Footer() {
	return (
		<footer className="relative container m-auto flex flex-col items-center border-t px-4 py-8 text-sm">
			<div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
				<div className="order-last flex flex-col-reverse items-center justify-center gap-4 text-center md:order-first md:items-start md:gap-6 md:text-left">
					<Copyright />
					<Socials />
				</div>
				<LazyNewsletter />
				<div className="order-first flex justify-center space-x-4 md:order-last md:justify-end">
					<div className="flex items-center gap-4">
						<LazyContactForm />
						<DonateButton />
					</div>
				</div>
			</div>
			<div className="flex w-full items-center justify-center text-xs text-muted-foreground md:mt-2 md:justify-start">
				<CustomLink
					to="/privacy-policy"
					className="underline underline-offset-2 hover:text-foreground hover:no-underline dark:hover:text-foreground/80"
				>
					Privacy Policy
				</CustomLink>
			</div>
		</footer>
	)
}
