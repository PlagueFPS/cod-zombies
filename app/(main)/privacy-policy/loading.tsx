import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import { Skeleton } from "@/components/ui/skeleton"

export default function PrivacyPolicyLoading() {
	return (
		<article className="flex w-full justify-center">
			<div className="mx-auto flex w-full max-w-(--desktop) flex-col items-center justify-start xl:mx-4">
				<div className="flex w-full grow flex-col-reverse justify-center xl:flex-row">
					<section className="flex w-full max-w-7xl flex-col items-center justify-center">
						<div className="relative mt-4 w-full xl:my-6">
							<div className="-top-10 absolute left-0 z-30 flex w-full justify-center pl-4 xl:pl-0">
								<Breadcrumbs links={[{ title: "Privacy Policy", href: `/privacy-policy` }]} />
							</div>
						</div>
						<div className="mb-4 flex w-full flex-col items-start justify-center border-b-2 px-4 pb-6 md:gap-4 md:px-8">
							<h2 className="dark:dark-text-gradient pb-2 font-extrabold text-4xl text-gradient md:text-5xl lg:text-6xl">
								Privacy Policy
							</h2>
							<span className="text-muted-foreground text-sm">
								Last Updated: {<Skeleton className="inline-block h-2.5 w-20" />}
							</span>
						</div>
						<Skeleton className="h-[150dvh] w-full max-w-[80ch] dark:bg-accent/50" />
					</section>
				</div>
			</div>
		</article>
	)
}
