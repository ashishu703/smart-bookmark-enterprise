export function DashboardLayout({ sidebar, children }) {
  return (
    <div className="flex h-screen bg-white">
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        {sidebar}
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  )
}
