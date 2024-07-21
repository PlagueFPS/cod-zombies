import dynamic from "next/dynamic"
import { Button } from "../ui/button"

const Copyright = dynamic(() => import('@/components/Footer/Copyright/Copyright'), {
  ssr: false,
})

export default function Footer() {
  return (
    <footer className='container flex justify-between items-center p-8 border-t'>
      <div className="flex gap-2 justify-center items-center text-sm text-muted-foreground">
        <Copyright />
        <div className="flex gap-1">
          Call of Duty:
          <span>Zombies Guides</span>
        </div>
      </div>
      <div>
        <Button variant="outline">
          Contact Us
        </Button>
      </div>
    </footer>
  )
}
