import { SettingsIcon } from "lucide-react"
import { useMapSettings } from "@/contexts/interactive-map-settings"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"

// TODO: Finish implementing the settings panel
export default function MapSettingsPanel() {
	const { settings, updateSettings } = useMapSettings()

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					size={"icon"}
					aria-label="Map Settings"
					className="fixed right-4 bottom-4 z-500 size-12"
				>
					<SettingsIcon className="size-6" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Interactive Map Settings</DialogTitle>
				<DialogDescription>
					Adjust the settings for all interactive maps. We&apos;ll remember your preferences for
					future visits.
				</DialogDescription>
				<div className="flex flex-col justify-center gap-2">
					<h3 className="font-semibold text-lg">Marker Settings</h3>
					<ul className="flex flex-col items-center justify-center gap-2">
						<li className="flex h-full w-full flex-col justify-center gap-1">
							<Label className="text-sm" htmlFor="icon-size">
								Icon Size
							</Label>
							<span className="text-muted-foreground text-xs">
								Adjusts the size of the marker icons on the map.
							</span>
							<div className="flex w-full items-center justify-between gap-2">
								<Slider
									value={[settings.markers.iconSize]}
									min={16}
									max={128}
									step={4}
									onValueChange={value =>
										updateSettings({
											markers: {
												...settings.markers,
												iconSize: value[0] ?? settings.markers.iconSize,
											},
										})
									}
									className="w-full grow"
								/>
								<Input
									type="number"
									name="icon-size"
									className="w-16 shrink-0 rounded-lg border p-2 text-xs"
									value={settings.markers.iconSize}
									onChange={e =>
										updateSettings({
											markers: {
												...settings.markers,
												iconSize: Number(e.target.value) || settings.markers.iconSize,
											},
										})
									}
								/>
							</div>
						</li>
					</ul>
				</div>
			</DialogContent>
		</Dialog>
	)
}
