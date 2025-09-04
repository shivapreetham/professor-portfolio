import { cn } from '@/lib/utils'

const Section = ({ className, children, ...props }) => {
  return (
    <section className={cn("py-12 lg:py-16", className)} {...props}>
      {children}
    </section>
  )
}

const SectionHeader = ({ className, title, subtitle, children, ...props }) => {
  return (
    <div className={cn("text-center mb-12 lg:mb-16", className)} {...props}>
      {title && (
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-base-content">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}

const SectionContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("container mx-auto px-4", className)} {...props}>
      {children}
    </div>
  )
}

export { Section, SectionHeader, SectionContent }