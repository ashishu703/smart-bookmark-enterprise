import { SupabaseRealtimeBookmarksGateway } from "../../infrastructure/SupabaseRealtimeBookmarksGateway"

const gateway = new SupabaseRealtimeBookmarksGateway()

export function subscribeToBookmarks({ userId, onPayload }) {
  return gateway.subscribeToBookmarks({ userId, onPayload })
}
