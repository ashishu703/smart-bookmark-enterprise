export function logError(message, meta) {
  if (import.meta.env.DEV) {
    console.error(message, meta)
  }
}

export function logInfo(message, meta) {
  if (import.meta.env.DEV) {
    console.info(message, meta)
  }
}
