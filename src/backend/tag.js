import * as db from './db'

export const getAvailableTags = async () => {
  return (await db.getTags()).map((t) => t.title)
}
