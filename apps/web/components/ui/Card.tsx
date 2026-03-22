import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered'
}

function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-gray-900/80 border border-gray-800',
    elevated: 'bg-gray-800/90 border border-gray-700 shadow-xl shadow-black/30',
    bordered: 'bg-transparent border-2 border-gray-700 hover:border-gray-600',
  }

  return (
    <div
      className={cn('rounded-xl backdrop-blur-sm', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-5 border-b border-gray-800', className)} {...props}>
      {children}
    </div>
  )
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-5', className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-800', className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-100', className)} {...props}>
      {children}
    </h3>
  )
}

function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-gray-400 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription }
