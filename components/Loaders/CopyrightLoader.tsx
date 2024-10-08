import { Skeleton } from "../ui/skeleton";

export default function CopyrightLoader() {
  return (
    <p className="flex items-center text-sm text-muted-foreground">
      &copy; <Skeleton className="w-9 h-4 ml-0.5 mr-1" /> Call of Duty: Zombies Guides
    </p>
  )
}
