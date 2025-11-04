export default function HeroSection() {
	return (
		<section className="flex max-w-2xl flex-col items-center justify-center gap-4 text-center">
			<h1 className="flex flex-col font-extrabold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
				<span className="dark:dark-text-gradient text-gradient">Unlock the Secrets of</span>
				<span className="flex items-center justify-center gap-2">
					<span className="dark:dark-text-gradient pb-2 text-gradient">Call of Duty:</span>
					<span className="pb-2 text-primary-gradient">Zombies</span>
				</span>
			</h1>
			<p className="text-foreground/75 md:text-lg">
				Explore our comprehensive guides to the most challenging and rewarding Main Quests, Side
				Quests, and Easter Eggs in Call of Duty: Zombies.
			</p>
		</section>
	)
}
