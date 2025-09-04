import { cn } from '@/lib/utils'

const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
    error: 'btn-error',
    warning: 'btn-warning',
    success: 'btn-success'
  }

  const sizes = {
    xs: 'btn-xs',
    sm: 'btn-sm', 
    md: '',
    lg: 'btn-lg'
  }

  return (
    <button 
      className={cn(
        'btn',
        variants[variant],
        sizes[size],
        className
      )} 
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }