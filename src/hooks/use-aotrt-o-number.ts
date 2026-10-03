import type { ONumber } from "@/utils/aotrt-o-number"
import { useSyncExternalStore } from "react"
import { readAotrtONumber, subscribeAotrtONumber } from "@/utils/aotrt-o-number-storage"

const readServerONumber = (): ONumber | null => null

/** The O number saved by the number tool for this browser session. */
export function useAotrtONumber(): ONumber | null {
	return useSyncExternalStore(subscribeAotrtONumber, readAotrtONumber, readServerONumber)
}
