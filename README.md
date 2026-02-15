# Smart Bookmark Enterprise

This project demonstrates a production-oriented bookmark SaaS architecture.

## Architecture

Clean Architecture layers:

- core (domain entities + repository contract)
- infrastructure (Supabase adapter)
- presentation (React UI)
- shared (retry, rate limit, utilities)

## Data Structures

Bookmarks stored in Map for:
- O(1) insert
- O(1) delete
- O(1) update

Cursor pagination implemented using created_at timestamp.

Virtualization handled via react-window.

## Database Schema

CREATE TABLE bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_created
ON bookmarks(user_id, created_at DESC);

Enable RLS and policy:

CREATE POLICY "user isolation"
ON bookmarks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

## Deployment

1. Create Supabase project
2. Add Google OAuth provider
3. Copy keys to .env
4. npm install
5. npm run build
6. Deploy dist folder to Vercel

## Scaling Strategy

- Stateless frontend
- Indexed queries (O(log n))
- Cursor pagination
- CDN caching
- Horizontal scaling ready
- Redis recommended for production cache

This codebase is structured for clarity, scalability, and long-term maintainability.
