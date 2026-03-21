import {
	Combobox,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxValue,
} from "@/components/ui/combobox"

interface IFilterLoader {
	placeholder: string
}

export function FilterLoader({ placeholder }: IFilterLoader) {
	return (
		<Combobox>
			<ComboboxChips className="w-full max-w-xs">
				<ComboboxValue>
					<ComboboxChipsInput
						disabled
						aria-disabled
						placeholder={`Filter by: ${placeholder}`}
						className="animate-pulse"
					/>
				</ComboboxValue>
			</ComboboxChips>
		</Combobox>
	)
}
