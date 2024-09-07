import { AlertCircle } from "lucide-react"

interface BlockquoteProps {
  title: string
  children: React.ReactNode
}

export default function RichBlockquote({ title, children }: BlockquoteProps) {
  return (
    <blockquote className="space-y-6 p-4">
      <div className="my-8 overflow-hidden rounded-xl bg-gradient-to-tl from-theme-100 via-theme-50 to-white p-[1px] shadow-lg dark:from-theme-700 dark:to-theme-800">
      <div className="rounded-xl bg-gradient-to-tl from-white to-theme-50 p-6 backdrop-blur-sm dark:from-black dark:via-black dark:to-theme-900">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-theme-700 dark:text-theme-400" aria-hidden="true" />
          <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-theme-700 to-theme-900 dark:from-theme-200 dark:via-theme-300 dark:to-theme-400">
            {title}
          </div>
        </div>
        <div className="text-theme-700 dark:text-theme-300">
          {children}
        </div>
      </div>
    </div>
    </blockquote>
  )
}