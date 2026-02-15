const MAX_URL_LENGTH = 2048

export function normalizeUrl(input) {
  const raw = String(input ?? "").trim()
  if (!raw) return { ok: false, reason: "empty" }
  if (raw.length > MAX_URL_LENGTH) return { ok: false, reason: "too_long" }

  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)
  const candidate = hasScheme ? raw : `https://${raw}`

  try {
    const u = new URL(candidate)
    if (u.protocol !== "https:" && u.protocol !== "http:") return { ok: false, reason: "protocol" }

    u.username = ""
    u.password = ""
    u.hash = ""

    return { ok: true, url: u.toString() }
  } catch {
    return { ok: false, reason: "invalid" }
  }
}

export function getDomainFromUrl(input) {
  try {
    const u = new URL(String(input))
    return u.hostname
  } catch {
    return ""
  }
}
