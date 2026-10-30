import type { ONumber } from "@/utils/aotrt-o-number"
import { Option } from "effect"
import { useSyncExternalStore } from "react"
import { readAotrtONumber, subscribeAotrtONumber } from "@/utils/aotrt-o-number-storage"

const readServerONumber = (): ONumber | null => null

const readSnapshot = () => readAotrtONumber().pipe(Option.getOrNull)

/** The O number saved by the number tool for this browser session. */
export function useAotrtONumber(): Option.Option<ONumber> {
	const oNumber = useSyncExternalStore(subscribeAotrtONumber, readSnapshot, readServerONumber)

	return Option.fromNullOr(oNumber)
}
