import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export function DataTableSkeleton({
  rows = 6,
  columns = 6,
  showToolbar = true,
}: {
  rows?: number
  columns?: number
  showToolbar?: boolean
}) {
  return (
    <div className="space-y-4">
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-full max-w-sm" />
          <div className="ms-auto flex items-center gap-2">
            <Skeleton className="h-7 w-28 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, column) => (
                <TableHead key={column} className="text-center">
                  <Skeleton className="mx-auto h-3.5 w-16" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, row) => (
              <TableRow key={row}>
                {Array.from({ length: columns }).map((_, column) => (
                  <TableCell key={column} className="text-center">
                    <Skeleton
                      className={cn(
                        'mx-auto h-4',
                        column === 0 && 'w-10',
                        column === columns - 1 && 'w-24'
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Skeleton className="h-8 w-36 rounded-md" />
        <Skeleton className="h-8 w-52 rounded-md" />
      </div>
    </div>
  )
}
