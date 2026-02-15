import { SupabaseBookmarkRepository } from "../../infrastructure/SupabaseBookmarkRepository"
import { normalizeUrl } from "../../domain/bookmarks/url"

const repo = new SupabaseBookmarkRepository()

export async function fetchBookmarksPage(userId, { cursor = null, limit = 50 } = {}) {
  return repo.fetchPaginated(userId, cursor, limit)
}

export async function addBookmark({ userId, title, url }) {
  const check = normalizeUrl(url)
  if (!check.ok) throw new Error(`Invalid URL: ${check.reason}`)
  const bookmark = {
    title,
    url: check.url,
    user_id: userId,
  }
  return repo.add(bookmark)
}

export async function deleteBookmark(id) {
  return repo.remove(id)
}
