"use client"
import { Button, type ButtonProps } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { 
  EmailIcon,
  EmailShareButton,
  FacebookIcon, 
  FacebookShareButton, 
  LinkedinIcon, 
  LinkedinShareButton, 
  RedditIcon, 
  RedditShareButton, 
  TwitterShareButton, 
  WhatsappIcon, 
  WhatsappShareButton,
  XIcon,
} from 'react-share'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Copy, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonProps extends ButtonProps {
  title: string
  url: string
}

export default function ShareButton({ title, url, ...props }: ShareButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    toast.success('Copied to Clipboard!')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" {...props} className='gap-2'>
          <span>Share</span>
          <Share2 className='w-4 h-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='gap-6'>
        <DialogHeader>
          <DialogTitle>Share on Social Media</DialogTitle>
          <DialogDescription>Share a link of the current page to a social platform</DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-3 items-center gap-y-4 w-full'>
          <div className='flex flex-col items-center justify-center gap-2 text-xs'>
            <TwitterShareButton url={ url } title={ title }>
              <XIcon size={ 40 } round />
            </TwitterShareButton>
            <span>X</span>
          </div>
          <div className='flex flex-col items-center justify-center gap-2 text-xs'>
            <RedditShareButton url={ url } title={ title }>
              <RedditIcon size={ 40 } round />
            </RedditShareButton>
            <span>Reddit</span>
          </div>
          <div className='flex flex-col items-center justify-center gap-2 text-xs'>
            <WhatsappShareButton url={ url } title={ title }>
              <WhatsappIcon size={ 40 } round />
            </WhatsappShareButton>
            <span>WhatsApp</span>
          </div>
          <div className='flex flex-col items-center justify-center gap-2 text-xs'>
            <FacebookShareButton url={ url } title={ title }>
              <FacebookIcon size={ 40 } round />
            </FacebookShareButton>
            <span>Facebook</span>
          </div>
          <div className='flex flex-col items-center justify-center gap-2 text-xs'>
            <LinkedinShareButton url={ url } title={ title }>
              <LinkedinIcon size={ 40 } round />
            </LinkedinShareButton>
            <span>LinkedIn</span>
          </div>
          <div className='flex flex-col items-center justify-center gap-2 text-xs'>
            <EmailShareButton url={ url } title={ title }>
              <EmailIcon size={ 40 } round />
            </EmailShareButton>
            <span>Email</span>
          </div>
        </div>
        <div className='flex items-center space-x-2 w-full'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link' className='sr-only'>Link</Label>
            <Input 
              id='link'
              defaultValue={ url }
              readOnly
            />
          </div>
          <Button type='submit' size="sm" className='px-3' onClick={ handleCopy }>
            <span className='sr-only'>Copy</span>
            <Copy className='h-4 w-4' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
