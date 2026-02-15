import { useReducer, useEffect, useMemo, useCallback, useRef } from "react"
import { fetchBookmarksPage, addBookmark, deleteBookmark } from "../../application/services/bookmark.service"
import { subscribeToBookmarks } from "../../application/services/realtime.service"
import { retry } from "../../shared/retry"
import { guard } from "../../shared/rateLimit"
import {
  createInitialBookmarksState,
  bookmarksReducer,
  BOOKMARK_ACTION,
} from "../../domain/bookmarks/bookmarkReducer"
import {
  selectBookmarksArray,
  deriveVisibleBookmarks,
  deriveBookmarkRows,
} from "../../domain/bookmarks/selectors"
import { SORT } from "../../domain/constants"

const DEBOUNCE_MS = 300
const PAGE_SIZE = 50

export function useBookmarksDashboard({ userId }) {
  const [state, dispatch] = useReducer(bookmarksReducer, createInitialBookmarksState())
  const dispatchRef = useRef(dispatch)
  dispatchRef.current = dispatch
  const debounceRef = useRef(null)

  const loadInitial = useCallback(async () => {
    if (!userId) return
    dispatchRef.current({ type: BOOKMARK_ACTION.setLoading, loading: true })
    dispatchRef.current({ type: BOOKMARK_ACTION.setError, error: null })
    try {
      const page = await retry(() => fetchBookmarksPage(userId, { limit: PAGE_SIZE }))
      dispatchRef.current({
        type: BOOKMARK_ACTION.pageLoaded,
        items: page.items,
        cursor: page.cursor,
        hasMore: page.hasMore,
      })
    } catch (e) {
      dispatchRef.current({ type: BOOKMARK_ACTION.setError, error: "Failed loading bookmarks" })
    } finally {
      dispatchRef.current({ type: BOOKMARK_ACTION.setLoading, loading: false })
    }
  }, [userId, dispatchRef])

  const loadMore = useCallback(async () => {
    if (!userId || state.loading || !state.hasMore || !state.cursor) return
    dispatchRef.current({ type: BOOKMARK_ACTION.setLoading, loading: true })
    try {
      const page = await fetchBookmarksPage(userId, { cursor: state.cursor, limit: PAGE_SIZE })
      dispatchRef.current({
        type: BOOKMARK_ACTION.pageLoaded,
        items: page.items,
        cursor: page.cursor,
        hasMore: page.hasMore,
      })
    } catch (e) {
      console.error("loadMore error", e)
    } finally {
      dispatchRef.current({ type: BOOKMARK_ACTION.setLoading, loading: false })
    }
  }, [userId, state.loading, state.hasMore, state.cursor, dispatchRef])

  const debouncedSetQuery = useCallback((next) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      dispatchRef.current({ type: BOOKMARK_ACTION.setQuery, query: next })
    }, DEBOUNCE_MS)
  }, [dispatchRef])

  const setQuery = debouncedSetQuery
  const setSort = useCallback((sort) => {
    dispatchRef.current({ type: BOOKMARK_ACTION.setSort, sort })
  }, [dispatchRef])

  const handleAdd = useCallback(
    async ({ title, url }) => {
      if (!guard(400)) return

      const optimisticId = crypto.randomUUID()
      const optimistic = {
        id: optimisticId,
        title,
        url,
        user_id: userId,
        created_at: new Date().toISOString(),
      }

      dispatchRef.current({
        type: BOOKMARK_ACTION.upsertOptimistic,
        bookmark: optimistic,
        rollback: null,
        optimisticId,
      })

      try {
        const inserted = await addBookmark({ userId, title, url })
        dispatchRef.current({
          type: BOOKMARK_ACTION.upsertOptimistic,
          bookmark: inserted,
          rollback: optimistic,
          optimisticId,
        })
        return true
      } catch (e) {
        dispatchRef.current({ type: BOOKMARK_ACTION.rollbackOptimistic, id: optimisticId })
        return false
      }
    },
    [userId, dispatchRef]
  )

  const handleDelete = useCallback(
    async (id) => {
      if (!guard(250)) return

      dispatchRef.current({ type: BOOKMARK_ACTION.removeOptimistic, id })

      try {
        await deleteBookmark(id)
      } catch (e) {
        dispatchRef.current({ type: BOOKMARK_ACTION.rollbackOptimistic, id })
      }
    },
    [dispatchRef]
  )

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  const subscriptionRef = useRef(null)

  useEffect(() => {
    if (!userId) return

    if (subscriptionRef.current) {
      subscriptionRef.current()
    }

    console.log("[useBookmarksDashboard] subscribing for userId:", userId)
    subscriptionRef.current = subscribeToBookmarks({
      userId,
      onPayload: (payload) => {
        console.log("[useBookmarksDashboard] received payload:", payload)
        dispatchRef.current({ type: BOOKMARK_ACTION.realtime, payload })
      },
    })

    return () => {
      if (subscriptionRef.current) {
        console.log("[useBookmarksDashboard] unsubscribing")
        subscriptionRef.current()
        subscriptionRef.current = null
      }
    }
  }, [userId, dispatchRef])

  // Fallback removed; we will rely on realtime only

  const bookmarkArray = useMemo(() => selectBookmarksArray(state.map), [state.map])

  const visible = useMemo(
    () => deriveVisibleBookmarks({ items: bookmarkArray, query: state.query, sort: state.sort }),
    [bookmarkArray, state.query, state.sort]
  )

  const rows = useMemo(() => deriveBookmarkRows(visible), [visible])

  return {
    loading: state.loading,
    error: state.error,
    query: state.query,
    sort: state.sort,
    rows,
    hasMore: state.hasMore,
    setQuery,
    setSort,
    loadMore,
    handleAdd,
    handleDelete,
  }
}
