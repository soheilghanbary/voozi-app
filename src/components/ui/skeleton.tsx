import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-shimmer rounded-md bg-linear-to-r bg-size-[200%_100%] from-foreground/10 via-muted/10 to-foreground/10',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
