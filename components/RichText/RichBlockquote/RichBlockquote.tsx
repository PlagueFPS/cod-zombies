import { AlertCircle } from "lucide-react"

interface BlockquoteProps {
  children: React.ReactNode
}

export default function RichBlockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="space-y-6 p-4">
      <div className="my-8 overflow-hidden rounded-xl bg-gradient-to-br from-orange-100 via-orange-50 to-white p-[1px] shadow-lg dark:from-orange-700 dark:to-orange-800">
        <div className="rounded-xl bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 backdrop-blur-sm dark:from-orange-950 dark:via-black dark:to-orange-950">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-700 dark:text-orange-400" aria-hidden="true" />
            <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-orange-700 to-orange-900 dark:from-orange-200 dark:via-orange-300 dark:to-orange-400">
              Important Note
            </div>
          </div>
          <div className="text-orange-700 dark:text-orange-300">
            {children}
          </div>
        </div>
      </div>
    </blockquote>
  )
}