import { ITag, ITagFull, ITagModel } from '../../types'
import * as db from './db'

export async function getAvailableTags(): Promise<string[]> {
  return (await db.getTags()).map((t: ITagModel) => t.title)
}

export async function getAllTags(): Promise<ITag[]> {
  return (await db.getTags()).map((tag: ITagModel) => ({
    ...tag,
    id: tag.title
  }))
}

export async function getTag(tagTitle: string): Promise<ITagFull> {
  const tagData = await db.getTagData(tagTitle)
  return {
    ...tagData,
    id: tagTitle,
    title: tagTitle
  }
}
