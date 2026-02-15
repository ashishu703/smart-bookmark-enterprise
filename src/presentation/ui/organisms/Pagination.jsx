import { Button } from "../atoms/Button"

function ChevronLeftIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19l-7-7 7-7"
      />
    </svg>
  )
}

function ChevronRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5l7 7-7 7"
      />
    </svg>
  )
}

export function Pagination({ visibleCount, totalCount, hasMore, onLoadMore, loading }) {
  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-slate-500">
        Showing {visibleCount} of {totalCount} result{totalCount !== 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm text-slate-700">1</span>
        <Button
          variant="ghost"
          size="sm"
          disabled={!hasMore || loading}
          onClick={onLoadMore}
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
