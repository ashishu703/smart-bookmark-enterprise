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

export function BookmarkTable({ rows, deletingId, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-3 px-4 font-medium text-slate-700">Title</th>
            <th className="text-left py-3 px-4 font-medium text-slate-700">Domain</th>
            <th className="text-left py-3 px-4 font-medium text-slate-700">Created</th>
            <th className="w-16" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-50">
              <td className="py-3 px-4">
                <a
                  href={row.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-700 hover:underline truncate max-w-xs block"
                >
                  {row.title}
                </a>
              </td>
              <td className="py-3 px-4 text-slate-500">{row.domain}</td>
              <td className="py-3 px-4 text-slate-500">{row.created_at}</td>
              <td className="py-3 px-4 text-right">
                <IconButton
                  variant="danger"
                  onClick={() => onDelete(row.id)}
                  disabled={deletingId === row.id}
                  aria-label={`Delete ${row.title}`}
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
