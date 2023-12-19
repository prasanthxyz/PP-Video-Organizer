import * as db from './db'

export async function getAvailableTags() {
  return (await db.getTags()).map((t) => t.title)
}

export async function getAllTags() {
  return (await db.getTags()).map((tag) => ({ ...tag, id: tag.title }))
}

export async function getTag(tagTitle) {
  const tagData = await db.getTagData(tagTitle)
  return {
    ...tagData,
    id: tagTitle
  }
}
