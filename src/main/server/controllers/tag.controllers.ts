import { Context } from 'koa'
import { ITagModel } from '../../../types'
import * as dataUtils from '../utils/data'
import * as tagUtils from '../utils/tag'

export function getAvailableTags(ctx: Context): void {
  ctx.body = tagUtils
    .getTags()
    .map((t: ITagModel) => t.title)
    .sort((a, b) => (a > b ? 1 : b > a ? -1 : 0))
}

export function getAllTags(ctx: Context): void {
  ctx.body = tagUtils
    .getTags()
    .map((tag: ITagModel) => ({
      ...tag,
      id: tag.title
    }))
    .sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
}

export function getTag(ctx: Context): void {
  const requestData = ctx.request.body as { tagTitle: string }
  const tagTitle = requestData.tagTitle
  const tagVideos = new Set(
    dataUtils.data.videoTags.filter((vt) => vt[1] === tagTitle).map((vt) => vt[0])
  )
  ctx.body = {
    id: tagTitle,
    title: tagTitle,
    videos: dataUtils.data.videos.filter((video) => tagVideos.has(video.filePath))
  }
}

export function createTags(ctx: Context): void {
  const requestData = ctx.request.body as { tagTitles: string }
  const tagTitles = requestData.tagTitles
  const existingTags = new Set(tagUtils.getTags().map((t: ITagModel) => t.title))
  const validTags = tagTitles
    .toLowerCase()
    .split(' ')
    .map((tagTitle) => tagTitle.trim())
    .filter((tagTitle) => tagTitle !== '' && !existingTags.has(tagTitle))
  dataUtils.data.tags.push(...validTags)
  dataUtils.storeData()
  ctx.body = { success: true }
}

export function deleteTag(ctx: Context): void {
  const requestData = ctx.request.body as { tagTitle: string }
  const tagTitle = requestData.tagTitle
  dataUtils.data.tags = dataUtils.data.tags.filter((tag) => tag !== tagTitle)
  dataUtils.data.videoTags = dataUtils.data.videoTags.filter((vt) => vt[1] !== tagTitle)
  dataUtils.storeData()
  ctx.body = { success: true }
}
