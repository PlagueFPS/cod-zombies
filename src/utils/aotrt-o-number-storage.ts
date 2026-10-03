import { Exit } from "effect"
import { decodeAotrtONumberString, type ONumber } from "@/utils/aotrt-o-number"

/** sessionStorage key for the O number calculated by the number tool. */
export const AOTRT_O_NUMBER_STORAGE_KEY = "aotrt-o-number"

const CHANGE_EVENT = "aotrt-o-number-change"

/** Read the session O number. Invalid or missing values are treated as unset. */
export function readAotrtONumber(): ONumber | null {
	if (typeof window === "undefined") return null

	const raw = window.sessionStorage.getItem(AOTRT_O_NUMBER_STORAGE_KEY)

	if (raw === null) return null

	return decodeAotrtONumberString(raw).pipe(
		Exit.match({
			onSuccess: value => value,
			onFailure: () => null,
		}),
	)
}

/** Save the O number and notify other tools on this page. */
export function writeAotrtONumber(oNumber: ONumber) {
	if (typeof window === "undefined") return

	const current = readAotrtONumber()
	window.sessionStorage.setItem(AOTRT_O_NUMBER_STORAGE_KEY, String(oNumber))

	if (current !== oNumber) {
		window.dispatchEvent(new Event(CHANGE_EVENT))
	}
}

export function subscribeAotrtONumber(onStoreChange: () => void) {
	const onStorage = (event: StorageEvent) => {
		if (event.key !== AOTRT_O_NUMBER_STORAGE_KEY) return
		onStoreChange()
	}

	window.addEventListener(CHANGE_EVENT, onStoreChange)
	window.addEventListener("storage", onStorage)

	return () => {
		window.removeEventListener(CHANGE_EVENT, onStoreChange)
		window.removeEventListener("storage", onStorage)
	}
}
