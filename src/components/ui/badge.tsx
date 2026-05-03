import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-forest-deep/10 text-forest-deep border border-forest-deep/20 dark:bg-forest-mid/20 dark:text-gold-light dark:border-forest-mid/40',
        dm: 'bg-gold/20 text-amber-800 border border-gold/40 dark:bg-gold/30 dark:text-gold-light',
        player: 'bg-forest-deep/10 text-forest-deep border border-forest-deep/20',
        destructive: 'bg-crimson/10 text-crimson border border-crimson/20',
        outline: 'border border-forest-deep/30 text-forest-deep',
        gold: 'bg-gold text-white',
        status: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/30 dark:text-amber-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
