import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import { ArrowRightToLine, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden mr-2' title='Toggle Nav' asChild>
          <Menu size={ 40 } className='text-primary cursor-pointer' />
      </SheetTrigger>
      <SheetContent className='flex flex-col p-0 bg-background border-border focus:border-border text-foreground'>
      <SheetHeader className='flex flex-row items-center text-foreground border-b border-border w-full p-4'>
        <SheetClose asChild>
            <ArrowRightToLine size={ 40 } className='text-primary cursor-pointer mx-1' />
        </SheetClose>
        <SheetClose asChild>
          <Link href='/' className='mx-auto text-2xl font-bold text-center'>
            <div>Call of Duty: <span className='text-primary'>Zombies</span></div>
          </Link>
        </SheetClose>
      </SheetHeader>
      <div className='flex flex-col flex-grow items-start gap-4 px-2 text-xl w-full'>
        <SheetClose asChild>
          <Button variant="ghost" asChild>
            <Link href='/black-ops-1' className='flex items-center justify-center gap-2'>
              <p className='text-foreground/80 text-xl font-light'>Black Ops 1</p>
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant="ghost" asChild>
            <Link href='/black-ops-2' className='flex gap-2'>
              <p className='text-foreground/80 text-xl font-light'>Black Ops 2</p>
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant="ghost" asChild>
            <Link href='/black-ops-3' className='flex gap-2'>
              <p className='text-foreground/80 text-xl font-light'>Black Ops 3</p>
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant="ghost" asChild>
            <Link href='/black-ops-4' className='flex gap-2'>
              <p className='text-foreground/80 text-xl font-light'>Black Ops 4</p>
            </Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant="ghost" asChild>
            <Link href='/black-ops-cold-war' className='flex gap-2'>
              <p className='text-foreground/80 text-xl font-light'>Black Ops Cold War</p>
            </Link>
          </Button>
        </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}