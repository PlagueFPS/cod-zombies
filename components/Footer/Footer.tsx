import dynamic from "next/dynamic"
import ContactForm from "../ContactForm/ContactForm"
import ThemeToggleLoader from "../Loaders/ThemeToggleLoader"
import Newsletter from "../Newsletter/Newsletter"

// dynamic import to avoid possible hydration error during year flip
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
    </footer>
  )
}