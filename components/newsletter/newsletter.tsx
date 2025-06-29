import NewsletterForm from '@/components/newsletter-form/newsletter-form'
import { CustomLink } from '@/components/custom-link/custom-link'

export default function Newsletter() {
  return (
    <div className='flex flex-col items-center text-center md:items-start md:text-start'>
      <div className='text-base'>Subscribe to our newsletter</div>
      <p className='text-sm text-muted-foreground mb-2'>Stay updated on new releases, important updates, and features.</p>
      <NewsletterForm />
      <CustomLink
        prefetch={ false } 
        href="/newsletter/unsubscribe" 
        className='underline underline-offset-4 hover:no-underline text-muted-foreground hover:text-foreground text-xs mt-2'
        >
        Unsubscribe
      </CustomLink>
    </div>
  )
}
