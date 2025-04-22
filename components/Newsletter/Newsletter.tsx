import NewsletterForm from './NewsletterForm'

export default function Newsletter() {
  return (
    <div className='flex flex-col items-center text-center md:items-start md:text-start'>
      <div className='text-base'>Subscribe to our newsletter</div>
      <p className='text-sm text-muted-foreground mb-2'>Stay updated on new releases, important updates, and features.</p>
      <NewsletterForm />
    </div>
  )
}
