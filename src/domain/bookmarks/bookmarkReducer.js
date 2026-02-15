import { REALTIME_EVENT } from "../constants"

export const BOOKMARK_ACTION = {
  reset: "reset",
  pageLoaded: "pageLoaded",
  upsertOptimistic: "upsertOptimistic",
  rollbackOptimistic: "rollbackOptimistic",
  removeOptimistic: "removeOptimistic",
  realtime: "realtime",
  setQuery: "setQuery",
  setSort: "setSort",
  setLoading: "setLoading",
  setError: "setError",
}

export function createInitialBookmarksState() {
  return {
    map: new Map(),
    cursor: null,
    hasMore: true,
    loading: false,
    error: null,
    query: "",
    sort: "newest",
    optimistic: new Map(),
  }
}

function mergeRealtimeUpdate(currentMap, payload) {
  const nextMap = new Map(currentMap)
  const record = payload.new ?? payload.old

  if (!record?.id) return currentMap

  switch (payload.eventType) {
    case REALTIME_EVENT.insert:
    case REALTIME_EVENT.update:
      nextMap.set(record.id, record)
      break
    case REALTIME_EVENT.delete:
      nextMap.delete(record.id)
      break
  }
  return nextMap
}

export function bookmarksReducer(state, action) {
  const type = action?.type

  if (type === BOOKMARK_ACTION.reset) {
    return createInitialBookmarksState()
  }

  if (type === BOOKMARK_ACTION.setLoading) {
    return { ...state, loading: Boolean(action?.loading) }
  }

  if (type === BOOKMARK_ACTION.setError) {
    return { ...state, error: action?.error ?? null }
  }

  if (type === BOOKMARK_ACTION.setQuery) {
    return { ...state, query: String(action?.query ?? "") }
  }

  if (type === BOOKMARK_ACTION.setSort) {
    return { ...state, sort: action?.sort }
  }

  if (type === BOOKMARK_ACTION.pageLoaded) {
    const list = action?.items ?? []
    const nextMap = new Map(state.map)

    for (const b of list) {
      if (b?.id) nextMap.set(b.id, b)
    }

    return {
      ...state,
      map: nextMap,
      cursor: action?.cursor ?? state.cursor,
      hasMore: Boolean(action?.hasMore),
    }
  }

  if (type === BOOKMARK_ACTION.upsertOptimistic) {
    const bookmark = action?.bookmark
    const optimisticId = action?.optimisticId
    if (!bookmark?.id || !optimisticId) return state

    const nextMap = new Map(state.map)
    nextMap.set(bookmark.id, bookmark)
    
    if (optimisticId !== bookmark.id) {
      nextMap.delete(optimisticId)
    }

    const optimistic = new Map(state.optimistic)
    optimistic.set(optimisticId, action?.rollback ?? null)

    return { ...state, map: nextMap, optimistic }
  }

  if (type === BOOKMARK_ACTION.rollbackOptimistic) {
    const id = action?.id
    if (!id) return state

    const optimistic = new Map(state.optimistic)
    const rollback = optimistic.get(id)
    if (!optimistic.has(id)) return state

    optimistic.delete(id)

    const nextMap = new Map(state.map)
    if (rollback) nextMap.set(id, rollback)
    else nextMap.delete(id)

    return { ...state, map: nextMap, optimistic }
  }

  if (type === BOOKMARK_ACTION.removeOptimistic) {
    const id = action?.id
    if (!id) return state

    const prev = state.map.get(id) ?? null

    const nextMap = new Map(state.map)
    nextMap.delete(id)

    const optimistic = new Map(state.optimistic)
    optimistic.set(id, prev)

    return { ...state, map: nextMap, optimistic }
  }

  if (type === BOOKMARK_ACTION.realtime) {
    const payload = action?.payload
    if (!payload?.eventType) return state

    const updatedMap = mergeRealtimeUpdate(state.map, payload)
    const optimistic = new Map(state.optimistic)

    const record = payload.new ?? payload.old
    // Remove optimistic entries that match the incoming record either by id
    // or by comparing the stored map value (title/url/user_id). For creates
    // the optimistic rollback may be null, so check the actual map entry.
    if (record?.id) {
      // If optimistic had an entry keyed by the real id, remove it
      if (optimistic.has(record.id)) {
        optimistic.delete(record.id)
      }

      for (const [optId] of optimistic) {
        const candidate = state.map.get(optId) ?? state.optimistic.get(optId)
        if (!candidate) continue

        // If candidate has same id as incoming record, remove optimistic
        if (candidate.id && candidate.id === record.id) {
          optimistic.delete(optId)
          if (optId !== record.id) updatedMap.delete(optId)
          continue
        }

        // If title/url/user_id match, assume it's the same bookmark created optimistically
        if (
          candidate.title === record.title &&
          candidate.url === record.url &&
          candidate.user_id === record.user_id
        ) {
          optimistic.delete(optId)
          updatedMap.delete(optId)
        }
      }
    }

    return { ...state, map: updatedMap, optimistic }
  }

  return state
}
