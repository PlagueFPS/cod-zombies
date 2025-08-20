import { MapIcon, MapPin, MessageSquare, SettingsIcon } from "lucide-react"
import { useState } from "react"
import { useMapSettings } from "@/contexts/interactive-map-settings"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import Shortcut from "../shortcut/shortcut"
import { Button } from "../ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { Slider } from "../ui/slider"
import { Switch } from "../ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export default function MapSettingsPanel() {
	const [open, setOpen] = useState(false)
	const { defaultSettings, settings, updateSettings } = useMapSettings()
	const [newSettings, setNewSettings] = useState(settings)
	const isMobile = useIsMobile(1280)

	const handleOpenChange = (open: boolean, cancel = false) => {
		if (cancel) {
			setNewSettings(settings)
		} else updateSettings(newSettings)

		setOpen(open)
	}

	useShortcut("shift+?", () => handleOpenChange(!open))

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size={"icon"}
						onClick={() => setOpen(true)}
						aria-label="Map Settings. Keyboard Shortcut: ?"
					>
						<SettingsIcon className="size-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent
					side="bottom"
					sideOffset={5}
					className="z-999 flex items-center justify-center gap-2"
				>
					<Shortcut shortcuts="?" size="sm" variant="ghost" />
					<span>Map Settings</span>
				</TooltipContent>
			</Tooltip>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Interactive Map Settings</DialogTitle>
					<DialogDescription>
						Customize your interactive map appearance and behavior.
					</DialogDescription>
				</DialogHeader>
				<Separator />
				<ScrollArea className="max-h-[35vh] pr-4">
					{/* Marker Settings */}
					<div className="space-y-4">
						<div className="flex items-center gap-1.5">
							<MapPin className="size-5 text-primary" />
							<h3 className="font-medium text-lg">Marker Settings</h3>
						</div>
						<div className="space-y-4 pl-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="icon-size" className="text-base">
										Icon Size
									</Label>
									<span className="text-muted-foreground text-sm">
										{newSettings.markers.iconSize}px
									</span>
								</div>
								<Slider
									id="icon-size"
									min={16}
									max={64}
									step={4}
									value={[newSettings.markers.iconSize]}
									onValueChange={value =>
										setNewSettings(prev => ({
											...prev,
											markers: {
												...prev.markers,
												iconSize: value[0] ?? prev.markers.iconSize,
											},
										}))
									}
									className="w-full"
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="icon-opacity" className="text-base">
										Opacity
									</Label>
									<span className="text-muted-foreground text-sm">
										{Math.floor(newSettings.markers.opacity * 100)}%
									</span>
								</div>
								<Slider
									id="icon-opacity"
									min={0}
									max={1}
									step={0.05}
									value={[newSettings.markers.opacity]}
									onValueChange={value =>
										setNewSettings(prev => ({
											...prev,
											markers: {
												...prev.markers,
												opacity: value[0] ?? prev.markers.opacity,
											},
										}))
									}
									className="w-full"
								/>
							</div>
						</div>
					</div>
					<Separator className="my-4" />
					{/* Popup Settings */}
					<div className="space-y-4">
						<div className="flex items-center gap-1.5">
							<MessageSquare className="size-5 text-primary" />
							<h3 className="font-medium text-lg">Popup Settings</h3>
						</div>
						<div className="space-y-4 pl-4">
							<div className="flex items-center justify-between">
								<div className="flex flex-col justify-center">
									<Label htmlFor="disable-gradients" className="text-base">
										Disable Gradients
									</Label>
									<p className="text-muted-foreground text-sm">
										Use solid colors instead of gradient backgrounds.
									</p>
								</div>
								<Switch
									id="disable-gradients"
									checked={newSettings.popups.disableGradients}
									onCheckedChange={value =>
										setNewSettings(prev => ({
											...prev,
											popups: {
												...prev.popups,
												disableGradients: value,
											},
										}))
									}
									className="cursor-pointer"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex flex-col justify-center">
									<Label htmlFor="disable-animations" className="text-base">
										Disable Animations
									</Label>
									<p className="text-muted-foreground text-sm">
										Turn off popup entrance and exit animations.
									</p>
								</div>
								<Switch
									id="disable-animations"
									checked={newSettings.popups.disableAnimations}
									onCheckedChange={value =>
										setNewSettings(prev => ({
											...prev,
											popups: {
												...prev.popups,
												disableAnimations: value,
											},
										}))
									}
									className="cursor-pointer"
								/>
							</div>
						</div>
					</div>
					<Separator className="my-4" />
					{/* General Settings */}
					<div className="space-y-2">
						<div className="flex items-center gap-1.5">
							<MapIcon className="size-5 text-primary" />
							<h3 className="font-medium text-lg">General Map Settings</h3>
						</div>
						<div className="space-y-4 pl-4">
							<div className="flex items-center justify-between space-y-2">
								<div className="flex flex-col justify-center">
									<Label htmlFor="disable-zoom-animation" className="text-base text-foreground">
										Disable Zoom Animation
									</Label>
									<p className="text-muted-foreground text-sm">
										Turn off zoom animation when zooming in or out on the map.
									</p>
								</div>
								<Switch
									id="disable-zoom-animation"
									checked={newSettings.general.disableZoomAnimation}
									onCheckedChange={value =>
										setNewSettings(prev => ({
											...prev,
											general: {
												...prev.general,
												disableZoomAnimation: value,
											},
										}))
									}
									className="ml-1 cursor-pointer"
								/>
							</div>
							<div className="flex items-center justify-between space-y-2">
								<div className="flex flex-col justify-center">
									<Label htmlFor="disable-fly-to-animation" className="text-base">
										Disable Flying Animation
									</Label>
									<p className="text-muted-foreground text-sm">
										Turn off flying animation when clicking on a marker on the map.
									</p>
								</div>
								<Switch
									id="disable-fly-to-animation"
									checked={newSettings.general.disableFlyToAnimation}
									onCheckedChange={value =>
										setNewSettings(prev => ({
											...prev,
											general: {
												...prev.general,
												disableFlyToAnimation: value,
											},
										}))
									}
									className="cursor-pointer"
								/>
							</div>
						</div>
					</div>
					<ScrollBar orientation="vertical" />
				</ScrollArea>
				<Separator />
				{/* Preview Section */}
				<div className="space-y-2">
					<h3 className="font-medium text-sm">Preview</h3>
					<div className="rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/50 p-4">
						<div className="flex items-center gap-3">
							<div
								className="flex items-center justify-center rounded-full bg-primary text-primary-foreground"
								style={{
									width: `${newSettings.markers.iconSize}px`,
									height: `${newSettings.markers.iconSize}px`,
									opacity: newSettings.markers.opacity,
								}}
							>
								<MapPin
									style={{
										width: `${newSettings.markers.iconSize * 0.6}px`,
										height: `${newSettings.markers.iconSize * 0.6}px`,
									}}
								/>
							</div>
							<div
								className={cn("rounded-md border bg-objectives px-4 py-2 text-center", {
									"bg-background": newSettings.popups.disableGradients,
								})}
							>
								<span className="text-xs">Popup Preview</span>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter className="flex-row justify-between">
					{!isMobile ? (
						<div className="mr-auto flex items-center justify-center gap-1 text-muted-foreground text-sm">
							<span>Keyboard Shortcut:</span>
							<Shortcut shortcuts="?" size="sm" />
						</div>
					) : null}
					<Button variant={"destructive"} onClick={() => handleOpenChange(false, true)}>
						Cancel
					</Button>
					<Button variant={"secondary"} onClick={() => setNewSettings(defaultSettings)}>
						Reset to Default
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
