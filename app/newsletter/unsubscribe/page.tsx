import type { Metadata } from 'next';
import UnsubscribeForm from "@/components/UnsubscribeForm/UnsubscribeForm";

export const metadata: Metadata = {
  title: "Newsletter Unsubscribe"
}

export default function NewsletterUnsubscribePage() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6">Unsubscribe from Newsletter</h1>
      <p className="mb-6 text-muted-foreground">
        Enter your email address below. We'll send you a confirmation link to complete the unsubscribe process.
      </p>
      <UnsubscribeForm />
    </div>
  )
}
