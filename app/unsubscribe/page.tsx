import UnsubscribeForm from '@/components/UnsubscribeForm/UnsubscribeForm'
import { UnsubscribePageSchema } from '@/utils/validationSchemas'
import type { SearchParams } from 'next/dist/server/request/search-params'

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { email } = UnsubscribePageSchema.parse(params)

  return (
    <div className="h-[75vh] bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl md:text-4xl font-extrabold">Unsubscribe</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          We're sorry to see you go. You can unsubscribe below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 mx-4 border rounded-lg sm:px-10">
          <UnsubscribeForm email={ email } />
        </div>
      </div>
    </div>
  )
}
