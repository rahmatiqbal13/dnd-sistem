import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-forest-deep/30 bg-white dark:bg-midnight/60 px-3 py-2 text-sm text-forest-deep dark:text-parchment placeholder:text-forest-light/60 focus:outline-none focus:ring-2 focus:ring-forest-mid focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
