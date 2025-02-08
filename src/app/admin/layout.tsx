export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
        {/* Add auth check here */}admin layout
        {children}
      </div>
    )
  }