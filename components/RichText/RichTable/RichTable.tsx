import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatTableCellData } from '@/utils/contentful-utils'
import { slugify, TypeGuards } from '@/utils/functions'
import ItemTooltip from '../RichEmbeds/ItemTooltip'

interface RichTableProps {
  headings: string[]
  bodyRows: unknown[]
}

export default function RichTable({ headings, bodyRows }: RichTableProps) {          
  return (
    <div className='border rounded-lg shadow-xl overflow-x-auto dark:shadow-none my-8'>
      <Table>
        <TableHeader className='rounded-t-xl dark:border-orange-700'>
          <TableRow>
            { headings.map(heading => (
              <TableHead key={ `table-heading-${slugify(heading)}` } className='text-orange-900 dark:text-orange-500'>{ heading }</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          { bodyRows.map((row, index) => (
            <TableRow key={ `table-row-${index}` } className={cn("hover:bg-orange-100 dark:hover:bg-muted/50",{ "bg-orange-50 dark:bg-background": index % 2 === 0 })}>
              { TypeGuards.isArray(row) && row.map((cell: any, cellIndex: number) => {
                const { values, badgeItems, embeddedItems } = formatTableCellData(cell.content[0].content)

                return (
                  <TableCell key={ `table-cell-${cellIndex}` } className='text-orange-800 dark:text-orange-200'>
                    { values.map(value => {
                      if (value) return value
                    })}
                    { badgeItems.length > 0 && (
                      <span className='inline-flex flex-col gap-2 items-start'>
                        { badgeItems.map((item, index) => {
                          if (item) return (
                            <Badge key={ `table-cell-badge-${index}` } className='badge-primary-gradient dark:dark-badge-primary-gradient' variant={"outline"}>{ item }</Badge>
                          )
                        })}
                      </span>
                    )}
                    { embeddedItems.length > 0 && (
                      <span className='inline-flex flex-col gap-2 items-start'>
                        { embeddedItems.map((item, index) => (
                          <ItemTooltip key={ `${item.title}-${index}` } item={ item } />
                        ))}
                      </span>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}