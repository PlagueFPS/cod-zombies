"use client"
import { Button, ButtonProps } from '../ui/button'

interface BackToTopButtonProps extends ButtonProps {}

export default function BackToTopButton({ ...props }: BackToTopButtonProps) {
  const scrollBackToTop = () => {
    window.scrollTo(0,0)
  }

  return (
    <Button onClick={ scrollBackToTop } {...props}>
      Back to Top
    </Button>
  )
}
