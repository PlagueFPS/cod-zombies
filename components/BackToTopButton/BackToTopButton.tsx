"use client"
import { ArrowUp } from 'lucide-react'
import { Button, ButtonProps } from '../ui/button'

interface BackToTopButtonProps extends ButtonProps {
  mobile?: boolean
}

export default function BackToTopButton({ mobile, ...props }: BackToTopButtonProps) {
  const scrollBackToTop = () => {
    window.scrollTo(0,0)
  }

  return (
    <>
      { mobile ? (
        <Button onClick={ scrollBackToTop } size="icon" className='fixed xl:hidden bottom-16 right-4 rounded-full z-20' title='Back to Top'>
          <ArrowUp className='h-6 w-6' />
        </Button>
      ) : (
        <Button onClick={ scrollBackToTop } {...props}>
          Back to Top
        </Button>
      )}
    </>
  )
}
