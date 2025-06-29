"use client"
import { cn } from "@/lib/utils"
import type { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { CustomLink } from "../custom-link/custom-link"

interface Props extends LinkProps {
  href: string
  children: string | React.ReactNode
  className?: string
  ariaLabel?: string
}

export default function NavLink({ href, children, className, ariaLabel, ...props }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <CustomLink 
      href={ href }
      aria-label={ ariaLabel }
      className={cn(className, { 'text-orange-600 dark:text-orange-200': isActive })}
      {...props}
    >
      { children }
    </CustomLink>
  )
}
