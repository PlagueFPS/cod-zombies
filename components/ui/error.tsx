import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "./button"

interface ErrorTitleProps {
  children: React.ReactNode
  className?: string
}

export function ErrorTitle({ children, className }: ErrorTitleProps) {
  return (
    <h1 className={cn(`text-center font-extrabold text-4xl tracking-tight md:text-5xl lg:text-6xl 
      text-transparent bg-clip-text bg-linear-to-b from-[#545454] to-black dark:from-white dark:to-[#adadad] pb-2`, className)}>
      { children }
    </h1>
  )
}

export function ErrorButton({ children, ...props }: React.ComponentProps<"button"> & ButtonProps) {
  return (
    <Button {...props}>
      { children }
    </Button>
  )
}

export function ErrorDescription({ children, className }: ErrorTitleProps) {
  return (
    <p className={cn('text-base lg:text-lg max-w-[80ch]', className)}>
      { children }
    </p>
  )
}