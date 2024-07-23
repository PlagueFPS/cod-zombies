import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import ContactForm from "../ContactForm/ContactForm"

const Copyright = dynamic(() => import('@/components/Footer/Copyright/Copyright'), {
  ssr: false,
})

export default function Footer() {
  return (
    <footer className='container relative text-sm flex flex-col-reverse gap-4 sm:flex-row justify-between items-center p-8 border-t mt-auto'>
      <div className="flex gap-2 justify-center items-center text-sm text-muted-foreground">
        <Copyright />
        <div className="flex gap-1">
          Call of Duty:
          <span>Zombies Guides</span>
        </div>
      </div>
      <div>
        <ContactForm />
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              Contact Us
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Form</DialogTitle>
              <DialogDescription>Share your feedback, suggestions, or other thoughts with us</DialogDescription>
            </DialogHeader>
            <ContactForm />
          </DialogContent>
        </Dialog> */}
      </div>
    </footer>
  )
}
