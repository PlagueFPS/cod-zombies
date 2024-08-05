import dynamic from "next/dynamic"
import ContactForm from "../ContactForm/ContactForm"

const Copyright = dynamic(() => import('@/components/Footer/Copyright/Copyright'), {
  ssr: false,
  loading: () => <div>&copy; { new Date().getFullYear() }</div>
})

export default function Footer() {
  return (
    <footer className='container relative text-sm flex flex-col-reverse gap-4 sm:flex-row justify-between items-center p-8 border-t mt-auto' role="contentinfo" tabIndex={ -1 }>
      <div className="flex gap-2 justify-center items-center text-sm text-muted-foreground">
        <Copyright />
        <div className="flex gap-1">
          Call of Duty:
          <span>Zombies Guides</span>
        </div>
      </div>
      <ContactForm />
    </footer>
  )
}
