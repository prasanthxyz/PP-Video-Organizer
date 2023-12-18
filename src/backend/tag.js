import * as db from './db'

export const getAvailableTags = async () => {
  return (await db.getTags()).map((t) => t.title)
}

export const getAllTags = async () => {
  return (await db.getTags()).map((tag) => ({ ...tag, id: tag.title }))
}
