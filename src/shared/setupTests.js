import { expect, afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

expect.extend({
  toBeMap(received) {
    const pass = received instanceof Map
    return {
      pass,
      message: () => `expected ${received} to be a Map`,
    }
  },
})

afterEach(() => {
  cleanup()
})
