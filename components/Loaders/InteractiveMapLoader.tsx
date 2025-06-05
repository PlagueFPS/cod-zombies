import { Loader2 } from "lucide-react";

export default function InteractiveMapLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-accent dark:bg-secondary-alternative w-full -mt-10">
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-20 text-primary animate-spin" />
          <span>Loading Interactive Map</span>
        </div>
      </div>
    </div>
  )
}
