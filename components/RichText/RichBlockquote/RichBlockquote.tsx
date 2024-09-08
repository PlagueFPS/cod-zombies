interface BlockquoteProps {
  children: React.ReactNode
}

export default function RichBlockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="space-y-6 p-4">
      <div className="my-8 overflow-hidden rounded-xl bg-gradient-to-tl from-theme-100 via-theme-50 to-white p-[1px] shadow-lg dark:from-theme-700 dark:to-theme-800">
      <div className="rounded-xl bg-gradient-to-tl from-white to-theme-50 py-3 px-6 backdrop-blur-sm dark:from-black dark:via-black dark:to-theme-900">
        <div className="text-theme-700 dark:text-theme-300">
          {children}
        </div>
      </div>
    </div>
    </blockquote>
  )
}