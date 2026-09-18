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
          <div className="h-9 w-full max-w-sm animate-pulse rounded-md bg-muted" />
          <div className="ms-auto flex items-center gap-2">
            <div className="h-7 w-28 animate-pulse rounded-md bg-muted" />
            <div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, column) => (
                <TableHead key={column} className="text-center">
                  <div className="mx-auto h-3.5 w-16 animate-pulse rounded bg-muted" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, row) => (
              <TableRow key={row}>
                {Array.from({ length: columns }).map((_, column) => (
                  <TableCell key={column} className="text-center">
                    <div
                      className={cn(
                        'mx-auto h-4 animate-pulse rounded bg-muted',
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
        <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-52 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}
