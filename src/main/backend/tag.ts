import { ITag, ITagFull, ITagModel } from '../../types'
import * as db from './db'

export async function getAvailableTags(): Promise<string[]> {
  return (await db.getTags())
    .map((t: ITagModel) => t.title)
    .sort((a, b) => (a > b ? 1 : b > a ? -1 : 0))
}

export async function getAllTags(): Promise<ITag[]> {
  return (await db.getTags())
    .map((tag: ITagModel) => ({
      ...tag,
      id: tag.title
    }))
    .sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
}

export async function getTag(tagTitle: string): Promise<ITagFull> {
  const tagData = await db.getTagData(tagTitle)
  return {
    ...tagData,
    id: tagTitle,
    title: tagTitle
  }
}
