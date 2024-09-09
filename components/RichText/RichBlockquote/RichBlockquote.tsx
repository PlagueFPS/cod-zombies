interface BlockquoteProps {
  children: React.ReactNode
}

export default function RichBlockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="space-y-6 p-4">
      <div className="my-8 overflow-hidden rounded-xl bg-gradient-to-tl from-orange-100 via-orange-50 to-white p-[1px] shadow-lg dark:from-orange-700 dark:to-orange-800">
      <div className="rounded-xl bg-gradient-to-tl from-white to-orange-50 py-3 px-6 backdrop-blur-sm dark:from-black dark:via-black dark:to-orange-900">
        <div className="text-orange-700 dark:text-orange-300">
          {children}
        </div>
      </div>
    </div>
    </blockquote>
  )
}