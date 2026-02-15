const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || typeof url !== "string" || !url.startsWith("http")) {
  throw new Error("Invalid or missing VITE_SUPABASE_URL")
}

if (!key || typeof key !== "string" || key.length < 20) {
  throw new Error("Invalid or missing VITE_SUPABASE_ANON_KEY")
}

export const ENV = { url, key }
