import { cn } from "@/lib/utils"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export default function FormError({ children, className, ...props }: Props) {
  return (
    <div aria-live='polite' className={cn('text-sm font-medium text-red-500', className)} {...props}>
      { children }
    </div>
  )
}