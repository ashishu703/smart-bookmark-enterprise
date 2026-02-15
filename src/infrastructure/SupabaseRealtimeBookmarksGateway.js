import { supabase } from "../shared/supabaseClient"
import { TABLES } from "../domain/constants"

export class SupabaseRealtimeBookmarksGateway {
  constructor() {
    this.processedEvents = new Map()
    this.eventCleanupInterval = 5000
    this.broadcastChannel = null
    this.subscribers = new Set()
    this.setupBroadcastChannel()
  }

  setupBroadcastChannel() {
    try {
      this.broadcastChannel = new BroadcastChannel("bookmarks-realtime")
      this.broadcastChannel.onmessage = (event) => {
        console.log("[SupabaseRealtimeBookmarksGateway] broadcast message received:", event.data)
        const { payload } = event.data
        const eventKey = `${payload.type}-${payload.new?.id || payload.old?.id}`
        this.processedEvents.set(eventKey, Date.now())
        // Notify local subscribers so other tabs apply the update immediately
        try {
          for (const cb of this.subscribers) {
            try { cb(payload) } catch (e) { console.log('[SupabaseRealtimeBookmarksGateway] subscriber callback error', e) }
          }
        } catch (e) {
          console.log('[SupabaseRealtimeBookmarksGateway] broadcast subscriber notify failed', e)
        }
      }
    } catch (e) {
      console.log("[SupabaseRealtimeBookmarksGateway] BroadcastChannel not supported")
    }
  }

  subscribeToBookmarks({ userId, onPayload }) {
    let channel = null
    let retryCount = 0
    const maxRetries = 3

    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, timestamp] of this.processedEvents.entries()) {
        if (now - timestamp > 10000) {
          this.processedEvents.delete(key)
        }
      }
    }, this.eventCleanupInterval)

    const connect = () => {
      retryCount++
      console.log(`[SupabaseRealtimeBookmarksGateway] connecting attempt ${retryCount}/${maxRetries}`)
      channel = supabase
        .channel(`bookmarks:user:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: TABLES.bookmarks,
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const eventKey = `${payload.type}-${payload.new?.id || payload.old?.id}`

            if (this.processedEvents.has(eventKey)) {
              console.log("[SupabaseRealtimeBookmarksGateway] duplicate event ignored:", eventKey)
              return
            }

            this.processedEvents.set(eventKey, Date.now())

            console.log("[SupabaseRealtimeBookmarksGateway] received payload:", payload)
            const eventType = payload.type
            const processedPayload = { ...payload, eventType }
            
            onPayload?.(processedPayload)
            // Register this subscription's callback so BroadcastChannel messages
            // can also notify it. We add the callback here and remove it when
            // the returned unsubscribe is called.
            if (onPayload) this.subscribers.add(onPayload)
            
            // Broadcast to other tabs
            try {
              this.broadcastChannel?.postMessage({ 
                type: "bookmark-event",
                payload: processedPayload 
              })
            } catch (e) {
              console.log("[SupabaseRealtimeBookmarksGateway] broadcast failed:", e)
            }
          }
        )
        .subscribe((status) => {
          console.log("[SupabaseRealtimeBookmarksGateway] subscription status:", status)
          if (status === "SUBSCRIBED") {
            retryCount = 0
          } else if (status === "CLOSED" && retryCount <= maxRetries) {
            setTimeout(connect, 2000 * retryCount)
          }
        })

      return () => {
        if (channel) {
          supabase.removeChannel(channel)
          channel = null
        }
      }
    }

    connect()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
        channel = null
      }
      // unregister subscriber
      if (onPayload) this.subscribers.delete(onPayload)
      clearInterval(cleanupInterval)
    }
  }
}
