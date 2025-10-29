import ContactForm from "../contact-form/contact-form"
import { CustomLink } from "../custom-link/custom-link"
import Newsletter from "../newsletter/newsletter"
import DonateButton from "../ui/donate-button"
import Copyright from "./copyright/copyright"
import Socials from "../socials/socials"

export default function Footer() {
	return (
		<footer className="container relative m-auto flex flex-col items-center border-t px-4 py-8 text-sm">
			<div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
				<div className="order-last flex flex-col-reverse items-center justify-center gap-4 text-center md:order-first md:items-start md:gap-6 md:text-left">
					<Copyright />
					<Socials />
				</div>
				<Newsletter />
				<div className="order-first flex justify-center space-x-4 md:order-last md:justify-end">
					<div className="flex items-center gap-4">
						<ContactForm />
						<DonateButton />
					</div>
				</div>
			</div>
			<div className="flex w-full items-center justify-center text-muted-foreground text-xs md:mt-2 md:justify-start">
				<CustomLink
					prefetch={false}
					href="/privacy-policy"
					className="underline underline-offset-2 hover:text-foreground hover:no-underline dark:hover:text-foreground/80"
				>
					Privacy Policy
				</CustomLink>
			</div>
		</footer>
	)
}
