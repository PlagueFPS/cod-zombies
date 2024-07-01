import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="container flex flex-col justify-center items-center text-foreground">
      <section className="flex flex-col items-center justify-center gap-4 text-center max-w-2xl">
        <h2 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Unlock the Secrets of Call of Duty: <span className="text-primary">Zombies</span>
        </h2>
        <p className="text-foreground text-lg">Explore our comprehensive guides to the most challenging and rewarding easter eggs in the Call of Duty Zombies universe</p>
        <Button className="mt-8 text-background">
          View Easter Egg Guides
        </Button>
      </section>
    </div>
  );
}
