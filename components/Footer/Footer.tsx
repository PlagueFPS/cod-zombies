import { Suspense } from "react"
import Copyright from "./Copyright/Copyright"
import CopyrightLoader from "../Loaders/CopyrightLoader"
import Newsletter from "../Newsletter/Newsletter"
import ContactForm from "../ContactForm/ContactForm"
import ThemeToggleWrapper from "../ThemeToggle/ThemeToggleWrapper"

export default function Footer() {
  return (
    <footer className='container relative text-sm flex flex-col items-center py-8 px-4 border-t m-auto' role="contentinfo" tabIndex={ -1 }>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="text-center md:text-left">
          <Suspense fallback={<CopyrightLoader />}>
            <Copyright />
          </Suspense>
        </div>
        <Newsletter />
        <div className="flex justify-center md:justify-end space-x-4">
          <div className="flex items-center gap-4">
            <ContactForm />
            <ThemeToggleWrapper />
          </div>
        </div>
      </div>
    </footer>
  )
}