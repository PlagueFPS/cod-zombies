import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb'
import NavLink from '../NavLink/NavLink'
import { Slash } from 'lucide-react'

interface IBreadcrumbs {
  items: {
    href: string
    text: string
  }[]
}

export default function NotFoundBreadcrumbs({ items }: IBreadcrumbs) {
  return (
    <Breadcrumb className='mr-auto ml-4'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink href='/'>Home</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        { items.map(item => (
          <>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem key={ `${item.href}_${item.text}` }>
              <BreadcrumbLink asChild>
                <NavLink href={ item.href }>{ item.text }</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
