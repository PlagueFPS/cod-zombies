import { cn } from "@/lib/utils";

interface ExternalLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> {}

export default function ExternalLink({ children, className, ...props }: ExternalLinkProps) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer" className={cn("transition-all hover:text-primary", className)}>
      { children }
    </a>
  )
}
