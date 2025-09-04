import { cn } from '@/lib/utils'

const Badge = ({ 
  className, 
  variant = 'primary', 
  size = 'md',
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    ghost: 'badge-ghost',
    outline: 'badge-outline',
    neutral: 'badge-neutral',
    info: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error'
  }

  const sizes = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg'
  }

  return (
    <div 
      className={cn(
        'badge',
        variants[variant],
        sizes[size],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge }