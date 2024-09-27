import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { slugify } from '@/utils/functions'

interface RichTableProps {
  headings: string[]
  bodyRows: any[]
}

export default function RichTable({ headings, bodyRows }: RichTableProps) {                 
  return (
    <div className='border rounded-lg w-full overflow-hidden shadow-2xl my-12'>
      <Table>
        <TableHeader className='rounded-t-xl overflow-hidden dark:border-orange-700'>
          <TableRow>
            { headings.map(heading => (
              <TableHead key={ `table-heading-${slugify(heading)}` } className='text-orange-950 dark:text-orange-500'>{ heading }</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          { bodyRows.map((row, index) => (
            <TableRow key={ `table-row-${index}` } className={cn("hover:bg-orange-100 dark:hover:bg-muted/50",{ "bg-orange-50 dark:bg-background": index % 2 === 0 })}>
              { row.map((cell: any, cellIndex: number) => {
                const values = cell.content[0].content.filter((content: any) => !content.value.includes(','))
                const listItems = cell.content[0].content.filter((content: any) => content.value.includes(','))
                const badgeItems: string[] = listItems.map((listItem: any) => listItem.value).join(',').split(',').map((word: string) => word.trim())
                return (
                  <TableCell key={ `table-cell-${cellIndex}` } className='text-orange-800 dark:text-orange-200'>
                    { values.map((content: any) => {
                      if (content.value) return content.value
                    })}
                    <div className='flex flex-wrap gap-1'>
                      { badgeItems.map((item, index) => {
                        if (item) return (
                          <Badge key={ `table-cell-badge-${index}` } className='badge-primary-gradient' variant={"outline"}>{ item }</Badge>
                        )
                      })}
                    </div>
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