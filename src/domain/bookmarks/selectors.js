import { SORT } from "../constants"
import { getDomainFromUrl } from "./url"

export function selectBookmarksArray(map) {
  return Array.from(map.values())
}

export function deriveVisibleBookmarks({ items, query, sort }) {
  const q = String(query ?? "").trim().toLowerCase()

  const filtered = q
    ? items.filter((b) => {
        const title = String(b?.title ?? "").toLowerCase()
        const url = String(b?.url ?? "").toLowerCase()
        return title.includes(q) || url.includes(q)
      })
    : items

  const dir = sort === SORT.oldest ? 1 : -1

  const sorted = [...filtered].sort((a, b) => {
    if (a.created_at === b.created_at) return a.id < b.id ? dir : -dir
    return a.created_at < b.created_at ? dir : -dir
  })

  return sorted
}

export function deriveBookmarkRows(items) {
  return items.map((b) => {
    const domain = getDomainFromUrl(b?.url)
    return {
      id: b?.id,
      title: b?.title,
      url: b?.url,
      domain,
      created_at: b?.created_at,
    }
  })
}
