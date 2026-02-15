# Smart Bookmark Enterprise

A small but production-oriented bookmark SaaS built with a pragmatic Clean-Architecture approach and realtime sync powered by Supabase. This README documents the project structure, design choices, how to run it locally, security and scaling considerations, and the recent cleanup and fixes performed in February 2026.

## Live demo

- Add your Vercel URL here: `https://your-project.vercel.app` (replace with your real deployment URL).

## First Project Overview

This project demonstrates a full-stack single-page application for personal bookmarks with:
- Fast, optimistic UI for CRUD operations
- Realtime sync across tabs and clients via Supabase Realtime + BroadcastChannel
- Cursor-based pagination for large lists
- Simple, production-ready domain layer and repository pattern

Tech choices favor simplicity, low operational burden, and developer velocity while keeping an eye on scale.

## Folder structure (top-level)

- `src/`
  - `application/services/` — thin application services that orchestrate repository and validation logic (fetch, add, delete)
  - `infrastructure/` — Supabase adapters: database repository and realtime gateway
  - `domain/` — business entities, reducers, selectors and constants
  - `presentation/` — React UI (atoms, molecules, organisms), pages and hooks
  - `shared/` — small utilities (env validation, retry, rate-limit wrappers, supabase client)

## Tech stack (and why)

- React + Vite: lightweight, fast developer experience and production builds.
- Supabase (Postgres + Realtime): provides managed Postgres with realtime change feed, authentication, and Row Level Security out of the box — ideal for a small team or prototype that can scale.
- Tailwind CSS: utility-first styling for rapid UI development.
- react-window: virtualization for rendering large lists efficiently.
- Vitest / Testing Library: lightweight test runner and DOM testing.

Reasoning: this stack minimizes backend work by leveraging Supabase while keeping the frontend fast and observable. It’s easy to iterate and to scale by moving heavy logic into server-side functions later.

## System architecture (high level)

- Client (browser): renders UI, keeps bookmarks in-memory (Map), performs optimistic updates for snappy UX, subscribes to realtime events.
- Supabase/Postgres: authoritative store for bookmarks, emits realtime postgres change events for inserts/updates/deletes.
- Realtime gateway (frontend): subscribes to Supabase realtime channel, deduplicates events, and broadcasts events to other tabs using BroadcastChannel.
- Reducer: merges realtime records into the client map and removes matching optimistic entries.

Flow for a new bookmark (summary):
1. User submits a bookmark via the UI.
2. Frontend creates an optimistic entry with a temporary UUID and shows it immediately.
3. Client calls Supabase to insert the bookmark.
4. Supabase returns the persisted record; frontend reconciles optimistic entry with server record.
5. Supabase realtime emits the insert to all connected clients; the gateway broadcasts to other browser tabs so they apply the same change quickly.

## Features & implementation details

- Bookmark CRUD
  - `addBookmark` validates and normalizes URL, then calls `SupabaseBookmarkRepository.add` (which uses `supabase.from('bookmarks').insert([...])`).
  - Optimistic create flow used for instant UX. The hook assigns a temporary `optimisticId` and shows the entry; when server record returns, reducer reconciles and removes temporary entry.
  - Delete is implemented with an optimistic removal and rollback on error.

- Pagination
  - Cursor-based pagination (encoded `created_at` + `id`) implemented in `SupabaseBookmarkRepository.fetchPaginated` to robustly page through a user's bookmarks.

- Search and sorting
  - Client-side search (debounced) runs over the in-memory Map -> array; sorting is applied in `deriveVisibleBookmarks`.

- Virtualization
  - `react-window` is available in the project for scalable list rendering (already in `package.json`).

## Data privacy (Row Level Security)

This project is designed to rely on Postgres Row Level Security (RLS). Example policy to enforce per-user access (execute this in Supabase SQL editor):

CREATE POLICY "user isolation"
ON bookmarks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

This ensures that only the authenticated user can read/write their own bookmarks. Never expose your service_role key in the browser — use the anon key and RLS policies.

## Real-time updates

- The realtime gateway subscribes to `postgres_changes` on the `bookmarks` table for the current `user_id`.
- It maintains a `processedEvents` map to deduplicate events that originated locally (or were already applied), and an `eventCleanupInterval` to expire old keys.
- On receiving a payload, it calls the subscriber callback and posts a message to a `BroadcastChannel` so other tabs can apply the same update quickly. The gateway also notifies registered subscribers when a broadcast arrives — this avoids double-processing while ensuring cross-tab immediacy.
- The reducer's `BOOKMARK_ACTION.realtime` merges the server record into the Map and removes matching optimistic entries by comparing IDs and content (title/url/user_id) to avoid duplicates.

## Bookmark CRUD (detailed)

- Add (frontend): `useBookmarksDashboard.handleAdd`
  - Normalize and validate URL (`domain/bookmarks/url.js`) and create an optimistic entry with `crypto.randomUUID()` as `optimisticId`.
  - Dispatch `upsertOptimistic` with the temporary record to show it immediately.
  - Call `addBookmark` which uses `SupabaseBookmarkRepository.add`.
  - On success, dispatch another `upsertOptimistic` with the server record to replace the optimistic entry; on failure dispatch `rollbackOptimistic`.

- Delete: optimistic remove via `removeOptimistic` and server call to delete; rollback if server fails.

## Database schema

Example `bookmarks` table used by the repository (Postgres):

```sql
CREATE TABLE bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_created
ON bookmarks(user_id, created_at DESC);
```

Indexing on `(user_id, created_at)` is important for efficient per-user queries sorted by creation date.

## Security considerations

- Row Level Security: enforce per-user access in the database.
- Input validation: URL normalization is applied before inserting into DB.
- Secrets: keep `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_URL` in environment variables, never commit them.
- Least privilege: use anon keys in browser and rely on RLS instead of exposing service_role.

## Environment variables

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon public key

These are validated at runtime in `src/shared/env.js` and the app throws early if missing or malformed.

## Setup instructions (local)

1. Copy `.env.example` or create an `.env` with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Install dependencies:

```bash
npm install
```

3. Run dev server:

```bash
npm run dev
```

4. Run tests:

```bash
npm test
# or
npx vitest
```

## Challenges faced & solutions

- Duplicate entries after optimistic create: caused by optimistic temporary entries plus Supabase realtime insert. Solution: reducer now reconciles by matching the actual stored optimistic map entry (title/url/user_id) and removes it when the server record arrives. Gateway also maintains a `processedEvents` map to avoid re-applying the same event.
- Cross-tab propagation: solved by combining Supabase realtime + BroadcastChannel and notifying subscribed callbacks so other tabs don't have to wait for Supabase event to arrive.
- Rate-limiting and retry: the frontend applies a small `guard` delay and `retry` wrapper for transient errors.

## Scalability & improvements

- Current design handles many users because most logic is push-based and the client keeps only a user's bookmarks in memory. To scale further:
  - Move deduplication and heavy reconciliation to a server-side component or Redis to coordinate across many server instances.
  - Add serverless functions for write-heavy or CPU-heavy tasks (e.g., URL enrichment, link scraping).
  - Introduce background jobs for expensive processing and caches (Redis) for hot data.
  - Use read replicas and partitioning if a single Postgres becomes a bottleneck.

## Performance considerations

- In-memory Map for bookmarks: O(1) insert/update/delete.
- Cursor-based pagination avoids expensive OFFSET queries.
- UI virtualization via `react-window` avoids rendering large lists at once.
- Deduplication uses a small map of processed event keys with time-based expiry to keep memory bounded.

## Design decisions & trade-offs

- Optimistic updates: chosen for a snappy UX; trade-off is temporary inconsistency and the need for reconciliation logic.
- Supabase Realtime: quick to integrate and low Ops overhead but gives eventual consistency semantics; strict consistency would require round-trips or other server-side coordination.
- Frontend deduplication vs server-side dedupe: currently handled client-side for simplicity; at very large scale a server-side dedupe (or persisted event ids) would be more robust.

## Where to look in the code (useful files)

- `src/presentation/hooks/useBookmarksDashboard.js` — primary hook that wires fetch, optimistic add/remove and subscriptions.
- `src/infrastructure/SupabaseRealtimeBookmarksGateway.js` — subscribes to Supabase realtime channel and broadcasts events across tabs.
- `src/infrastructure/SupabaseBookmarkRepository.js` — DB pagination / add / delete logic.
- `src/domain/bookmarks/bookmarkReducer.js` — reducer with optimistic/rollback/realtime merge logic.
- `src/application/services/bookmark.service.js` — entry points used by the hook to mutate/persist bookmarks.

---

If you want, I can:
- run the dev server and smoke-test the flow,
- reintroduce a restored README Live demo URL if you provide it,
- convert the project to TypeScript or add server-side dedupe using Redis and an idempotency key flow.

Tell me which next step you prefer.
