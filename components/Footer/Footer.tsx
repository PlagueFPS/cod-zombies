import dynamic from "next/dynamic"
import ContactForm from "../ContactForm/ContactForm"
import ThemeToggleLoader from "../Loaders/ThemeToggleLoader"
import Newsletter from "../Newsletter/Newsletter"

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
    <footer className='container relative text-sm flex flex-col items-center py-8 px-4 border-t m-auto' role="contentinfo" tabIndex={ -1 }>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="text-center md:text-left">
          <Copyright />
        </div>
        <Newsletter />
        <div className="flex justify-center md:justify-end space-x-4">
          <ContactForm />
          <ThemeToggle />
        </div>
      </div>
      {/* <Newsletter />
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
        <div className="flex flex-col gap-2 items-center xl:items-start justify-center text-xs text-muted-foreground max-w-sm">
          <div className="flex gap-1.5 justify-center items-center">
            <Copyright />
            <div className="flex gap-1">
              Call of Duty:
              <span>Zombies Guides</span>
            </div>
          </div>
          <span className="tracking-tight">
            All content, including but not limited to images, logos, and trademarks related to Activision games, are property of Activision Publishing, Inc. and its respective owners.
          </span>
        </div>
        <div className="flex gap-8 justify-center items-center border-b pb-4 sm:border-none sm:pb-0">
          <ContactForm />
          <ThemeToggle />
        </div>
      </div> */}
    </footer>
  )
}