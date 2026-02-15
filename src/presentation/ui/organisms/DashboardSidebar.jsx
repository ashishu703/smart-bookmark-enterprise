export function DashboardSidebar({ userEmail, onSignOut }) {
  return (
    <nav className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Smart Bookmarks</h2>
      </div>

      <ul className="flex-1 p-4 space-y-1 text-sm">
        <li>
          <button
            className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
            aria-current="page"
          >
            Dashboard
          </button>
        </li>
      </ul>

      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 mb-2">{userEmail}</div>
        <button
          onClick={onSignOut}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
