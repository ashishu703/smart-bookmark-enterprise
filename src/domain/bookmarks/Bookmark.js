/**
 * @typedef {Object} BookmarkProps
 * @property {string} id
 * @property {string} user_id
 * @property {string} title
 * @property {string} url
 * @property {string} created_at
 */

export class Bookmark {
  /** @param {BookmarkProps} props */
  constructor({ id, user_id, title, url, created_at }) {
    this.id = id
    this.user_id = user_id
    this.title = title
    this.url = url
    this.created_at = created_at
  }

  /** @param {BookmarkProps} props */
  static from(props) {
    return new Bookmark(props)
  }
}
