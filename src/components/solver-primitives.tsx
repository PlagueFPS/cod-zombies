import { cn } from "cn"
import { CheckIcon, CopyIcon, MinusIcon, PlusIcon, RotateCcwIcon } from "lucide-react"
import { type ComponentProps, type ReactNode, useEffect, useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Root card shell for quest solvers. Resets prose spacing inherited from
 * `rich-text.module.css` (`p` and `li` margins) so solver layouts stay tight.
 */
export function SolverCard({ className, ...props }: ComponentProps<typeof Card>) {
	return (
		<Card
			className={cn(
				"mx-auto my-6 w-full gap-5 border border-border/80 bg-card/60 py-5 shadow-sm ring-1 ring-border/40 dark:bg-card/40 dark:shadow-none [&_li]:m-0 [&_p]:m-0 [&_p]:tracking-normal [&_ul]:m-0",
				className,
			)}
			{...props}
		/>
	)
}

interface SolverHeaderProps {
	title: ReactNode
	description?: ReactNode
	badge?: ReactNode
	className?: string
}

/** Consistent centered header for solver cards. */
export function SolverHeader({ title, description, badge, className }: SolverHeaderProps) {
	return (
		<CardHeader
			className={cn("items-center justify-items-center gap-1.5 px-5 text-center", className)}
		>
			{badge ? (
				<span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-primary">
					{badge}
				</span>
			) : null}
			<CardTitle className="text-lg font-semibold tracking-tight text-balance sm:text-xl">
				{title}
			</CardTitle>
			{description ? (
				<CardDescription className="max-w-md text-sm text-pretty">{description}</CardDescription>
			) : null}
		</CardHeader>
	)
}

type SolverResultTone = "idle" | "solved" | "warning" | "error"

interface SolverResultProps {
	tone?: SolverResultTone
	label?: ReactNode
	action?: ReactNode
	className?: string
	children: ReactNode
}

const TONE_STYLES: Record<SolverResultTone, string> = {
	idle: "border-dashed border-border/80 bg-muted/30 dark:bg-muted/15",
	solved:
		"border-primary/35 bg-primary/[0.06] dark:bg-primary/[0.09] animate-solver-reveal motion-reduce:animate-none",
	warning: "border-amber-500/35 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-400/10",
	error:
		"border-destructive/35 bg-destructive/10 dark:border-destructive/40 dark:bg-destructive/15",
}

const LABEL_TONE_STYLES: Record<SolverResultTone, string> = {
	idle: "text-muted-foreground",
	solved: "text-primary",
	warning: "text-amber-700 dark:text-amber-300",
	error: "text-destructive",
}

/** Shared live-region container for solver outputs, prompts, and error states. */
export function SolverResult({
	tone = "idle",
	label,
	action,
	className,
	children,
}: SolverResultProps) {
	return (
		<div
			aria-live="polite"
			className={cn(
				"rounded-xl border px-4 py-3.5 transition-[background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
				TONE_STYLES[tone],
				className,
			)}
		>
			{label || action ? (
				<div className="mb-2 flex items-center justify-between gap-2">
					{label ? (
						<span
							className={cn(
								"text-[11px] font-semibold tracking-wider uppercase",
								!action && "mx-auto",
								LABEL_TONE_STYLES[tone],
							)}
						>
							{label}
						</span>
					) : (
						<span />
					)}
					{action}
				</div>
			) : null}
			{children}
		</div>
	)
}

interface CopyCodeButtonProps {
	value: string
	label?: string
	className?: string
}

/** Tactile copy-to-clipboard button for solved codes and step summaries. */
export function CopyCodeButton({ value, label = "Copy code", className }: CopyCodeButtonProps) {
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (!copied) return

		const timer = window.setTimeout(() => setCopied(false), 1600)

		return () => window.clearTimeout(timer)
	}, [copied])

	const handleCopy = async () => {
		try {
			await navigator.clipboard?.writeText(value)
			setCopied(true)
		} catch {
			// Clipboard API unavailable in restricted contexts.
		}
	}

	return (
		<Button
			type="button"
			variant="ghost"
			size="xs"
			onClick={handleCopy}
			aria-label={copied ? "Copied" : label}
			className={cn(
				"gap-1 text-muted-foreground hover:bg-background/70 hover:text-foreground",
				copied && "text-primary hover:text-primary",
				className,
			)}
		>
			{copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
			<span>{copied ? "Copied" : "Copy"}</span>
		</Button>
	)
}

/** Understated reset action that preserves the accessible "Reset" button name. */
export function SolverResetButton({ className, children, ...props }: ButtonProps) {
	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			className={cn(
				"gap-1.5 text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive",
				className,
			)}
			{...props}
		>
			<RotateCcwIcon className="size-3.5" />
			{children ?? "Reset"}
		</Button>
	)
}

interface SolverNumberInputProps {
	id: string
	name: string
	label: string
	value: string
	onValueChange: (value: string) => void
	placeholder?: string
	min?: number
	max?: number
	step?: number
	className?: string
}

/**
 * Centered numeric input with integrated tactile `-` / `+` stepper buttons,
 * replacing the browser's native spin button.
 */
export function SolverNumberInput({
	id,
	name,
	label,
	value,
	onValueChange,
	placeholder,
	min = 0,
	max,
	step = 1,
	className,
}: SolverNumberInputProps) {
	const parsed = value.trim() === "" ? Number.NaN : Number(value)
	const hasNumericValue = Number.isFinite(parsed)
	const canDecrement = hasNumericValue && parsed > min
	const canIncrement = !hasNumericValue || max === undefined || parsed < max

	const handleStep = (delta: number) => {
		const base = hasNumericValue ? parsed : min - step
		const rawNext = base + delta

		const clamped =
			max !== undefined ? Math.min(max, Math.max(min, rawNext)) : Math.max(min, rawNext)

		onValueChange(String(clamped))
	}

	return (
		<div
			className={cn(
				"group/stepper flex h-11 w-full items-stretch overflow-hidden rounded-xl border border-input bg-background/80 shadow-xs/5 ring-ring/24 transition-[border-color,box-shadow,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-within:border-ring focus-within:ring-[3px] dark:bg-input/32",
				className,
			)}
		>
			<button
				type="button"
				tabIndex={-1}
				onClick={() => handleStep(-step)}
				disabled={!canDecrement}
				aria-label={`Decrease ${label}`}
				className="flex w-7 shrink-0 items-center justify-center border-r border-border/60 text-muted-foreground transition-[transform,color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none active:scale-[0.92] disabled:pointer-events-none disabled:opacity-30 disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-8 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted/60 [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
			>
				<MinusIcon className="size-3.5" />
			</button>

			<input
				type="number"
				inputMode="numeric"
				id={id}
				name={name}
				value={value}
				onChange={event => onValueChange(event.target.value)}
				placeholder={placeholder}
				autoComplete="off"
				min={min}
				max={max}
				step={step}
				className="w-full min-w-0 flex-1 appearance-none bg-transparent px-1 text-center font-mono text-lg font-semibold text-foreground tabular-nums outline-none placeholder:text-muted-foreground/50 sm:text-xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
			/>

			<button
				type="button"
				tabIndex={-1}
				onClick={() => handleStep(step)}
				disabled={!canIncrement}
				aria-label={`Increase ${label}`}
				className="flex w-7 shrink-0 items-center justify-center border-l border-border/60 text-muted-foreground transition-[transform,color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none active:scale-[0.92] disabled:pointer-events-none disabled:opacity-30 disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-8 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted/60 [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
			>
				<PlusIcon className="size-3.5" />
			</button>
		</div>
	)
}
