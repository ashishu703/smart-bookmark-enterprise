import { useState } from "react"
import { useBookmarksDashboard } from "../hooks/useBookmarksDashboard"
import { signOut } from "../../application/services/auth.service"
import { DashboardLayout } from "../ui/layouts/DashboardLayout"
import { DashboardSidebar } from "../ui/organisms/DashboardSidebar"
import { Card, CardContent, CardHeader } from "../ui/atoms/Card"
import { ErrorMessage } from "../ui/atoms/ErrorMessage"
import { EmptyState } from "../ui/atoms/EmptyState"
import { Spinner } from "../ui/atoms/Spinner"
import { Button } from "../ui/atoms/Button"
import { SearchInput } from "../ui/atoms/SearchInput"
import { BookmarkForm } from "../ui/organisms/BookmarkForm"
import { BookmarkTable } from "../ui/organisms/BookmarkTable"
import { BookmarkTableSkeleton } from "../ui/organisms/BookmarkTableSkeleton"
import { Pagination } from "../ui/organisms/Pagination"
import { FormField } from "../ui/molecules/FormField"
// Removed unused imports: Input and SORT

export function DashboardPage({ session, onToast }) {
  const userId = session?.user?.id
  const userEmail = session?.user?.email
  const [deletingId, setDeletingId] = useState(null)

  const {
    loading,
    error,
    query,
    sort,
    rows,
    hasMore,
    setQuery,
    setSort,
    loadMore,
    handleAdd,
    handleDelete,
  } = useBookmarksDashboard({ userId })

  const handleAddWithToast = async (values) => {
    const ok = await handleAdd(values)
    onToast?.(ok ? "Bookmark added" : "Failed adding bookmark")
  }

  const handleDeleteWithToast = async (id) => {
    setDeletingId(id)
    try {
      await handleDelete(id)
      onToast?.("Bookmark deleted")
    } catch {
      onToast?.("Failed deleting bookmark")
    } finally {
      setDeletingId(null)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch {
      onToast?.("Sign out failed")
    }
  }

  return (
    <DashboardLayout
      sidebar={<DashboardSidebar userEmail={userEmail} onSignOut={handleSignOut} />}
    >
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Bookmarks Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <p className="text-sm font-semibold text-gray-900">Add a Bookmark</p>
            <p className="mt-1 text-xs text-gray-500">Your bookmarks are private to your account.</p>
          </CardHeader>
          <CardContent>
            <BookmarkForm onSubmit={handleAddWithToast} loading={loading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-sm font-semibold text-gray-900">Bookmarks Today</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search bookmarks..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="ghost" size="sm" disabled aria-label="Grid view">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none">
                    <path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" disabled aria-label="List view">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none">
                    <path stroke="currentColor" strokeWidth="2" d="M4 6h7M4 12h7M4 18h7M13 6h7M13 12h7M13 18h7" />
                  </svg>
                </Button>
              </div>

              {loading && rows.length === 0 ? (
                <BookmarkTableSkeleton />
              ) : error ? (
                <ErrorMessage message={error} />
              ) : rows.length === 0 ? (
                <EmptyState
                  title="No bookmarks yet"
                  description="Add your first link using the form above."
                />
              ) : (
                <BookmarkTable rows={rows} deletingId={deletingId} onDelete={handleDeleteWithToast} />
              )}

              {rows.length > 0 && (
                <Pagination
                  visibleCount={rows.length}
                  totalCount={rows.length}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  loading={loading}
                />
              )}

              
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
