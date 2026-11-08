/** @vitest-environment happy-dom */
import { Schema, Result } from "effect"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, test } from "vitest"
import { MapSettingsProvider, useMapSettings } from "@/contexts/interactive-map-settings"

let root: Root | undefined

afterEach(async () => {
	await act(async () => root?.unmount())
	root = undefined
	localStorage.clear()
})

describe("MapSettingsProvider", () => {
	test.each([null, [], { _version: 1 }, { _version: 1, markers: { iconSize: "large" } }])(
		"uses complete defaults for malformed stored settings: %j",
		async stored => {
			localStorage.setItem(
				"map-settings",
				Result.getOrThrow(Schema.encodeResult(Schema.fromJsonString(Schema.Unknown))(stored)),
			)
			const container = document.createElement("div")
			document.body.appendChild(container)
			root = createRoot(container)

			await act(async () =>
				root?.render(
					<MapSettingsProvider>
						<Settings />
					</MapSettingsProvider>,
				),
			)

			expect(container.textContent).toBe("1:32:false")
		},
	)

	test("migrates validated older settings while preserving preferences", async () => {
		localStorage.setItem(
			"map-settings",
			Result.getOrThrow(
				Schema.encodeResult(Schema.fromJsonString(Schema.Unknown))({
					_version: 0,
					markers: { iconSize: 48, opacity: 0.5 },
					popups: { disableGradients: false, disableAnimations: false },
					general: { disableZoomAnimation: true, disableFlyToAnimation: false },
				}),
			),
		)
		const container = document.createElement("div")
		document.body.appendChild(container)
		root = createRoot(container)

		await act(async () =>
			root?.render(
				<MapSettingsProvider>
					<Settings />
				</MapSettingsProvider>,
			),
		)

		expect(container.textContent).toBe("1:48:true")
		expect(
			Schema.decodeResult(Schema.fromJsonString(Schema.Struct({ _version: Schema.Int })))(
				localStorage.getItem("map-settings") ?? "null",
			).pipe(Result.getOrThrow)._version,
		).toBe(1)
	})
})

function Settings() {
	const { settings } = useMapSettings()

	return (
		<span>
			{settings._version}:{settings.markers.iconSize}:
			{String(settings.general.disableZoomAnimation)}
		</span>
	)
}
