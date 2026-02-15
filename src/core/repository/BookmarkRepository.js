export class BookmarkRepository {
  /** @param {string} userId @param {string|null} cursor @param {number} limit @returns {Promise<{items:any[], cursor:string|null, hasMore:boolean}>} */
  async fetchPaginated(userId, cursor, limit) {}

  /** @param {any} bookmark @returns {Promise<any>} inserted row */
  async add(bookmark) {}

  /** @param {string} id @returns {Promise<void>} */
  async remove(id) {}
}
