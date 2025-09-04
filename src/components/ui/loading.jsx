import { cn } from '@/lib/utils'

const LoadingSpinner = ({ className, size = 'lg', ...props }) => {
  const sizes = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-base-200", className)} {...props}>
      <div className="text-center">
        <span className={cn("loading loading-spinner loading-lg text-primary", sizes[size])}></span>
        <p className="mt-4 text-base-content/70">Loading...</p>
      </div>
    </div>
  )
}

const LoadingCard = ({ className, ...props }) => {
  return (
    <div className={cn("card bg-base-100 shadow-xl animate-pulse", className)} {...props}>
      <div className="card-body">
        <div className="h-6 bg-base-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-base-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-base-300 rounded w-2/3"></div>
      </div>
    </div>
  )
}

export { LoadingSpinner, LoadingCard }