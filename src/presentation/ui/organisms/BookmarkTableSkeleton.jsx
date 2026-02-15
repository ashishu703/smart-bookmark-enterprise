import { Skeleton } from "../atoms/Skeleton"

export function BookmarkTableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
        </div>
      ))}
    </div>
  )
}
