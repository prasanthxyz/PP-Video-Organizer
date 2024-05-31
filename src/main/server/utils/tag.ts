import { ITag } from '../../../types'
import * as dataUtils from './data'
import * as relationsUtils from './relations'

export function getAllTags(): ITag[] {
  return dataUtils.data.tags
    .map(getTagData)
    .sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
}

export function getTagData(tagTitle: string): ITag {
  return {
    id: tagTitle,
    title: tagTitle,
    videos: relationsUtils.getTagVideos(tagTitle)
  }
}

export function createTags(tagTitles: string): void {
  const existingTags = new Set(dataUtils.data.tags)
  const validTags = tagTitles
    .toLowerCase()
    .split(' ')
    .map((tagTitle) => tagTitle.trim())
    .filter((tagTitle) => tagTitle !== '' && !existingTags.has(tagTitle))
  dataUtils.data.tags.push(...validTags)
  dataUtils.storeData()
}

export function deleteTag(tagTitle: string): void {
  dataUtils.data.tags = dataUtils.data.tags.filter((tag) => tag !== tagTitle)
  dataUtils.data.videoTags = dataUtils.data.videoTags.filter((vt) => vt[1] !== tagTitle)
  dataUtils.storeData()
}
