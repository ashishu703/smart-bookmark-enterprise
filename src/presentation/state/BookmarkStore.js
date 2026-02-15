export class BookmarkStore {
  constructor() { this.map = new Map() }
  add(b){ this.map.set(b.id,b) }
  remove(id){ this.map.delete(id) }
  setAll(list){ this.map.clear(); for(const b of list) this.map.set(b.id,b) }
  getAll(){ return Array.from(this.map.values()) }
}
