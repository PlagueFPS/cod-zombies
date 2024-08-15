import dynamic from "next/dynamic"
import ContactForm from "../ContactForm/ContactForm"
import ThemeToggleLoader from "../Loaders/ThemeToggleLoader"

// dynamic import to avoid possible hydration error during year flip
// won't be an issue with Next 15 due to PPR & unstable_noStore()
const Copyright = dynamic(() => import('@/components/Footer/Copyright/Copyright'), {
  ssr: false,
  loading: () => <div>&copy; { new Date().getFullYear() }</div>
})

// dynamic import to avoid hydration error for theme based styles
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle/ThemeToggle'), {
  ssr: false,
  loading: () => <ThemeToggleLoader />
})

export default function Footer() {
  return (
    <footer className='container relative text-sm flex flex-col-reverse gap-4 sm:flex-row justify-between items-center p-8 border-t mt-auto' role="contentinfo" tabIndex={ -1 }>
      <div className="flex flex-col gap-2 items-center xl:items-start justify-center text-xs text-muted-foreground max-w-sm">
        <div className="flex gap-1.5 justify-center items-center">
          <Copyright />
          <div className="flex gap-1">
            Call of Duty:
            <span>Zombies Guides</span>
          </div>
        </div>
        <span>
          All content, including but not limited to images, logos, and trademarks related to Activision games, are property of Activision Publishing, Inc. and its respective owners.
        </span>
      </div>
      <div className="flex gap-8 justify-center items-center border-b pb-4 sm:border-none sm:pb-0">
        <ContactForm />
        <ThemeToggle />
      </div>
    </footer>
  )
}
