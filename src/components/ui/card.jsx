import { cn } from '@/lib/utils'

const Card = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("card bg-base-100 shadow-xl", className)} 
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("card-body pb-0", className)} 
      {...props}
    >
      {children}
    </div>
  )
}

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 
      className={cn("card-title text-xl", className)} 
      {...props}
    >
      {children}
    </h3>
  )
}

const CardContent = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("card-body pt-2", className)} 
      {...props}
    >
      {children}
    </div>
  )
}

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("card-actions justify-end p-6 pt-0", className)} 
      {...props}
    >
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter }