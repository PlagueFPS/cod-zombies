import { Info } from "lucide-react"

interface BlockquoteProps {
  children: React.ReactNode
}

export default function RichBlockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="dark:bg-orange-900/20 bg-orange-100/20 border dark:border-orange-800 border-orange-200 rounded-lg p-4 mt-6 shadow-lg">
      <div className="dark:text-orange-300 text-orange-700 flex items-start">
        <Info className="w-5 h-5 mr-2 shrink-0 dark:text-orange-400 text-orange-800" />
        <em>
          { children }
        </em>
      </div>
    </blockquote>
  )
}