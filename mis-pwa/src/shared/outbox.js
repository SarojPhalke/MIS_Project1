import { openDB } from 'idb'

async function getDb() {
  return openDB('mis-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('outbox')) db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true })
    },
  })
}

export function useOutbox() {
  async function queue(entry) {
    const db = await getDb()
    await db.add('outbox', entry)
  }
  return { queue }
}


