import { supabase } from "../shared/supabaseClient"
import { BookmarkRepository } from "../core/repository/BookmarkRepository"
import { decodeCursor, encodeCursor } from "../domain/bookmarks/cursor"

export class SupabaseBookmarkRepository extends BookmarkRepository {
  async fetchPaginated(userId, cursor, limit = 20) {
    let query = supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit + 1)

    if (cursor) {
      const decoded = decodeCursor(cursor)
      if (decoded) {
        query = query.lt("created_at", decoded.created_at).or(`created_at.eq.${decoded.created_at}&id.lt.${decoded.id}`)
      }
    }

    const { data, error } = await query
    if (error) throw error

    const hasMore = data.length > limit
    const items = hasMore ? data.slice(0, limit) : data
    const last = items[items.length - 1]

    return {
      items,
      cursor: last ? encodeCursor({ created_at: last.created_at, id: last.id }) : null,
      hasMore,
    }
  }

  async add(bookmark) {
    const { data, error } = await supabase.from("bookmarks").insert([bookmark]).select().single()
    if (error) throw error
    return data
  }

  async remove(id) {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id)
    if (error) throw error
  }
}
