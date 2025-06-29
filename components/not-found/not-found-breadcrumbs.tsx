import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'

interface IBreadcrumbs {
  items: {
    href: string
    title: string
  }[]
}

export default function NotFoundBreadcrumbs({ items }: IBreadcrumbs) {
  return (
    <Breadcrumbs 
      links={ items }
      className='ml-4'
    />
  )
}
