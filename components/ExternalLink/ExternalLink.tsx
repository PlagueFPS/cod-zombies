import { cn } from "@/lib/utils";

export default function ExternalLink({ children, className, ...props }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer" className={cn("transition-all hover:text-primary", className)}>
      { children }
    </a>
  )
}
