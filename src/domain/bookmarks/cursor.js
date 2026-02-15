const SEP = "::"

export function encodeCursor({ created_at, id }) {
  if (!created_at || !id) return null
  return `${created_at}${SEP}${id}`
}

export function decodeCursor(cursor) {
  const raw = String(cursor ?? "")
  const idx = raw.indexOf(SEP)
  if (idx === -1) return null
  const created_at = raw.slice(0, idx)
  const id = raw.slice(idx + SEP.length)
  if (!created_at || !id) return null
  return { created_at, id }
}
