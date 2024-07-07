import { Headings } from "@/types/Headings"
import Link from "next/link"

interface TableOfContentsProps {
  headings: Headings[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <nav className="flex flex-col gap-4">
      <div className="font-bold">On this page</div>
      <ul className="flex flex-col gap-3 text-muted-foreground font-medium text-sm">
        { headings.map(heading => (
          <li key={ heading.id } className="hover:text-primary transition-all">
            <Link href={ `#${heading.id}` }>
              { heading.text }
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
