import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Button, type ButtonProps } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "../ui/drawer"
import { cn } from "@/lib/utils"

interface ModalProps extends ButtonProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
  triggerIcon: React.ReactNode
  triggerText: string
  title: string
  description: string
}

export default function Modal({ children, triggerIcon, triggerText, title, description, className, open, setOpen, ...props }: ModalProps) {
  const isDesktop = useMediaQuery(768)

  if (isDesktop) {
  return (
    <Dialog open={ open } onOpenChange={ setOpen }>
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

  return (
    <Drawer open={ open } onOpenChange={ setOpen }>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("flex rounded-sm gap-2 text-muted-foreground", className)} {...props}>
          { triggerIcon }
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-lg">
        <DrawerHeader>
          <DrawerTitle>{ title }</DrawerTitle>
          <DrawerDescription>{ description }</DrawerDescription>
        </DrawerHeader>
        { children }
      </DrawerContent>
    </Drawer>
  )
}
