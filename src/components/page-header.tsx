import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: React.ReactNode
  description?: React.ReactNode
  backHref?: string
  backLabel?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 pt-4',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {backHref && (
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link href={backHref} />}
            aria-label={backLabel ?? 'بازگشت'}
          >
            <ArrowRight />
          </Button>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-black text-xl">{title}</h1>
          {description && (
            <p className="mt-0.5 text-muted-foreground text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
