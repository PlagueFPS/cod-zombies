import { useHotkey, type RegisterableHotkey } from "@tanstack/react-hotkeys"
import { cn } from "cn"
import { Match, Array as Arr, Predicate } from "effect"
import { CornerUpLeft, MapIcon, MapPin, MessageSquare, SettingsIcon } from "lucide-react"
import { useState } from "react"
import { Shortcut } from "@/components/shortcut"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
	type TMapSettings,
	type TSettingPath,
	useMapSettings,
} from "@/contexts/interactive-map-settings"
import { useIsMobile } from "@/hooks/use-mobile"

function settingValue(settings: TMapSettings, path: TSettingPath) {
	return Match.value(path).pipe(
		Match.when("markers.iconSize", () => settings.markers.iconSize),
		Match.when("markers.opacity", () => settings.markers.opacity),
		Match.when("popups.disableGradients", () => settings.popups.disableGradients),
		Match.when("popups.disableAnimations", () => settings.popups.disableAnimations),
		Match.when("general.disableZoomAnimation", () => settings.general.disableZoomAnimation),
		Match.when("general.disableFlyToAnimation", () => settings.general.disableFlyToAnimation),
		Match.exhaustive,
	)
}

function withResetSetting(settings: TMapSettings, defaults: TMapSettings, path: TSettingPath) {
	return Match.value(path).pipe(
		Match.when("markers.iconSize", () => ({
			...settings,
			markers: { ...settings.markers, iconSize: defaults.markers.iconSize },
		})),
		Match.when("markers.opacity", () => ({
			...settings,
			markers: { ...settings.markers, opacity: defaults.markers.opacity },
		})),
		Match.when("popups.disableGradients", () => ({
			...settings,
			popups: { ...settings.popups, disableGradients: defaults.popups.disableGradients },
		})),
		Match.when("popups.disableAnimations", () => ({
			...settings,
			popups: { ...settings.popups, disableAnimations: defaults.popups.disableAnimations },
		})),
		Match.when("general.disableZoomAnimation", () => ({
			...settings,
			general: {
				...settings.general,
				disableZoomAnimation: defaults.general.disableZoomAnimation,
			},
		})),
		Match.when("general.disableFlyToAnimation", () => ({
			...settings,
			general: {
				...settings.general,
				disableFlyToAnimation: defaults.general.disableFlyToAnimation,
			},
		})),
		Match.exhaustive,
	)
}

export default function MapSettingsPanel() {
	const [open, setOpen] = useState(false)
	const { defaultSettings, settings, updateSettings } = useMapSettings()
	const [newSettings, setNewSettings] = useState(settings)
	const isMobile = useIsMobile(1280)
	const [activeTab, setActiveTab] = useState("markers")
	const settingsShortcut: RegisterableHotkey = { key: "/", shift: true }

	const handleOpenChange = (open: boolean, save = false) => {
		if (save) {
			updateSettings(newSettings)
		} else setNewSettings(settings)

		setOpen(open)
	}

	useHotkey(settingsShortcut, () => handleOpenChange(!open))

	const hasSettingChanged = (settingPath: TSettingPath) =>
		settingValue(newSettings, settingPath) !== settingValue(defaultSettings, settingPath)

	const resetSetting = (settingPath: TSettingPath) => {
		if (settingValue(newSettings, settingPath) === settingValue(defaultSettings, settingPath)) {
			return
		}

		setNewSettings(currentSettings =>
			withResetSetting(currentSettings, defaultSettings, settingPath),
		)
	}

	return (
		<Dialog open={open} onOpenChange={open => handleOpenChange(open)}>
			<Tooltip>
				<TooltipTrigger
					render={<Button variant="outline" size="icon-lg" />}
					aria-label="Map Settings. Keyboard Shortcut: ?"
					onClick={() => setOpen(true)}
					className="w-full sm:p-2"
				>
					<SettingsIcon className="size-4" />
				</TooltipTrigger>
				<TooltipContent
					side="left"
					sideOffset={5}
					className="z-999 flex items-center justify-center gap-2"
				>
					<Shortcut shortcut={settingsShortcut} size="sm" variant="ghost" />
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
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-3 bg-input/30">
						<TabsTrigger value="markers" className="group flex items-center gap-1.5">
							<MapPin className="size-4 group-data-[state=active]:text-primary" />
							<span>Markers</span>
						</TabsTrigger>
						<TabsTrigger value="popups" className="group flex items-center gap-1.5">
							<MessageSquare className="size-4 group-data-[state=active]:text-primary" />
							<span>Popups</span>
						</TabsTrigger>
						<TabsTrigger value="general" className="group flex items-center gap-1.5">
							<MapIcon className="size-4 group-data-[state=active]:text-primary" />
							<span>General</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="markers" className="mt-4 space-y-4">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="icon-size" className="flex items-center gap-2 text-base">
									Icon Size
									{hasSettingChanged("markers.iconSize") && (
										<Tooltip>
											<TooltipTrigger
												className="cursor-pointer text-foreground/60 transition-colors hover:text-foreground"
												onClick={e => {
													e.preventDefault()
													resetSetting("markers.iconSize")
												}}
											>
												<CornerUpLeft className="size-4" />
											</TooltipTrigger>
											<TooltipContent className="z-999" side="right" sideOffset={4}>
												Reset to Default
											</TooltipContent>
										</Tooltip>
									)}
								</Label>
								<span className="text-sm text-muted-foreground">
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
											iconSize:
												Arr.isArray(value) && Predicate.isNumber(value[0])
													? value[0]
													: Predicate.isNumber(value)
														? value
														: prev.markers.iconSize,
										},
									}))
								}
								className="h-1 w-full"
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="icon-opacity" className="flex items-center gap-2 text-base">
									Opacity
									{hasSettingChanged("markers.opacity") && (
										<Tooltip>
											<TooltipTrigger
												className="cursor-pointer text-foreground/60 transition-colors hover:text-foreground"
												onClick={e => {
													e.preventDefault()
													resetSetting("markers.opacity")
												}}
											>
												<CornerUpLeft className="size-4" />
											</TooltipTrigger>
											<TooltipContent className="z-999" side="right" sideOffset={4}>
												Reset to Default
											</TooltipContent>
										</Tooltip>
									)}
								</Label>
								<span className="text-sm text-muted-foreground">
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
											opacity:
												Arr.isArray(value) && Predicate.isNumber(value[0])
													? value[0]
													: Predicate.isNumber(value)
														? value
														: prev.markers.opacity,
										},
									}))
								}
								className="w-full"
							/>
						</div>
					</TabsContent>

					<TabsContent value="popups" className="mt-4 space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex flex-col justify-center">
								<Label htmlFor="disable-gradients" className="flex items-center gap-2 text-base">
									Disable Gradients
									{hasSettingChanged("popups.disableGradients") && (
										<Tooltip>
											<TooltipTrigger
												className="cursor-pointer text-foreground/60 transition-colors hover:text-foreground"
												onClick={e => {
													e.preventDefault()
													resetSetting("popups.disableGradients")
												}}
											>
												<CornerUpLeft className="size-4" />
											</TooltipTrigger>
											<TooltipContent className="z-999" side="right" sideOffset={4}>
												Reset to Default
											</TooltipContent>
										</Tooltip>
									)}
								</Label>
								<p className="text-sm text-muted-foreground">
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
								<Label htmlFor="disable-animations" className="flex items-center gap-2 text-base">
									Disable Animations
									{hasSettingChanged("popups.disableAnimations") && (
										<Tooltip>
											<TooltipTrigger
												className="cursor-pointer text-foreground/60 transition-colors hover:text-foreground"
												onClick={e => {
													e.preventDefault()
													resetSetting("popups.disableAnimations")
												}}
											>
												<CornerUpLeft className="size-4" />
											</TooltipTrigger>
											<TooltipContent className="z-999" side="right" sideOffset={4}>
												Reset to Default
											</TooltipContent>
										</Tooltip>
									)}
								</Label>
								<p className="text-sm text-muted-foreground">
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
					</TabsContent>

					<TabsContent value="general" className="mt-4 space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex flex-col justify-center">
								<Label
									htmlFor="disable-zoom-animation"
									className="flex items-center gap-2 text-base text-foreground"
								>
									Disable Zoom Animation
									{hasSettingChanged("general.disableZoomAnimation") && (
										<Tooltip>
											<TooltipTrigger
												className="cursor-pointer text-foreground/60 transition-colors hover:text-foreground"
												onClick={e => {
													e.preventDefault()
													resetSetting("general.disableZoomAnimation")
												}}
											>
												<CornerUpLeft className="size-4" />
											</TooltipTrigger>
											<TooltipContent className="z-999" side="right" sideOffset={4}>
												Reset to Default
											</TooltipContent>
										</Tooltip>
									)}
								</Label>
								<p className="text-sm text-muted-foreground">
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
						<div className="flex items-center justify-between">
							<div className="flex flex-col justify-center">
								<Label
									htmlFor="disable-fly-to-animation"
									className="flex items-center gap-2 text-base"
								>
									Disable Flying Animation
									{hasSettingChanged("general.disableFlyToAnimation") && (
										<Tooltip>
											<TooltipTrigger
												className="cursor-pointer text-foreground/60 transition-colors hover:text-foreground"
												onClick={e => {
													e.preventDefault()
													resetSetting("general.disableFlyToAnimation")
												}}
											>
												<CornerUpLeft className="size-4" />
											</TooltipTrigger>
											<TooltipContent className="z-999" side="right" sideOffset={4}>
												Reset to Default
											</TooltipContent>
										</Tooltip>
									)}
								</Label>
								<p className="text-sm text-muted-foreground">
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
					</TabsContent>
				</Tabs>
				<Separator />
				<div className="space-y-2">
					<h3 className="text-sm font-medium">Preview</h3>
					<div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-4">
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
						<div className="mr-auto flex items-center justify-center gap-1 text-sm text-muted-foreground">
							<span>Keyboard Shortcut:</span>
							<Shortcut shortcut={settingsShortcut} size="sm" />
						</div>
					) : null}
					<Button variant={"destructive"} onClick={() => handleOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => handleOpenChange(false, true)}
						className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
