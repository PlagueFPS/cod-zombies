"use client"
import { useRouter } from "next/navigation"
import { Button, type ButtonProps } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { cn } from "@/lib/utils"

interface ModalProps extends ButtonProps {
  children: React.ReactNode
  triggerIcon: React.ReactNode
  triggerText: string
  title: string
  description: string
}

export default function Modal({ children, triggerIcon, triggerText, title, description, className, ...props }: ModalProps) {
  const router = useRouter()

  return (
    <Dialog open onOpenChange={ () => router.back() }>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn("hidden sm:flex rounded-sm gap-2 text-muted-foreground", className)} {...props}>
          { triggerIcon }
          <span className="hidden xl:inline-block">{ triggerText }</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>{ title }</DialogTitle>
          <DialogDescription>{ description }</DialogDescription>
        </DialogHeader>
        { children }
      </DialogContent>
    </Dialog>
  )
}
