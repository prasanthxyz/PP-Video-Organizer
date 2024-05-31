import { Context } from 'koa'
import { ITag } from '../../../types'
import * as tagUtils from '../utils/tag'

export function getAllTags(ctx: Context): void {
  const allTags: ITag[] = tagUtils.getAllTags()
  ctx.body = allTags
}

export function getTag(ctx: Context): void {
  const requestData = ctx.request.body as { tagTitle: string }
  const tagData: ITag = tagUtils.getTagData(requestData.tagTitle)
  ctx.body = tagData
}

export function createTags(ctx: Context): void {
  const requestData = ctx.request.body as { tagTitles: string }
  tagUtils.createTags(requestData.tagTitles)
  ctx.body = { success: true }
}

export function deleteTag(ctx: Context): void {
  const requestData = ctx.request.body as { tagTitle: string }
  tagUtils.deleteTag(requestData.tagTitle)
  ctx.body = { success: true }
}
