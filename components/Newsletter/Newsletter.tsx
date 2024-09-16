import NewsletterForm from './NewsletterForm'

export default function Newsletter() {
  return (
    <div className='flex flex-col items-center text-center md:items-start md:text-start'>
      <h5 className='text-base mb-2'>Subscribe to our newsletter</h5>
      <p className='text-sm text-muted-foreground'>Stay updated on new releases, important updates, and features.</p>
      <NewsletterForm />
    </div>
  )
}
