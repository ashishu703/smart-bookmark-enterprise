import { IconButton } from "../atoms/IconButton"

function TrashIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M9 3h6m-7 4h8m-9 0h10m-1 0-.8 14.2A2 2 0 0 1 13.2 23H10.8a2 2 0 0 1-1.996-1.8L8 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 11v7M14 11v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function BookmarkList({ items, onDelete, deletingId }) {
  return (
    <div className="divide-y divide-slate-100" role="list" aria-label="Bookmarks">
      {items.map((b) => (
        <div key={b.id} className="flex items-center justify-between gap-4 py-4" role="listitem">
          <div className="min-w-0">
            <a
              href={b.url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-semibold text-indigo-700 hover:underline"
            >
              {b.title}
            </a>
            <p className="mt-1 truncate text-xs text-slate-500">{b.url}</p>
          </div>
          <IconButton
            variant="danger"
            onClick={() => onDelete(b.id)}
            disabled={deletingId === b.id}
            aria-label={`Delete ${b.title}`}
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </IconButton>
        </div>
      ))}
    </div>
  )
}
