import { Context } from 'koa'
import { IDiffObj } from '../../../types'
import * as relationsUtils from '../utils/relations'

export function updateVideoGalleries(ctx: Context): void {
  const requestData = ctx.request.body as { videoPath: string; diffObj: IDiffObj }
  relationsUtils.updateVideoGalleries(requestData.videoPath, requestData.diffObj)
  ctx.body = { success: true }
}

export function updateVideoTags(ctx: Context): void {
  const requestData = ctx.request.body as { videoPath: string; diffObj: IDiffObj }
  relationsUtils.updateVideoTags(requestData.videoPath, requestData.diffObj)
  ctx.body = { success: true }
}

export function updateGalleryVideos(ctx: Context): void {
  const requestData = ctx.request.body as { galleryPath: string; diffObj: IDiffObj }
  relationsUtils.updateGalleryVideos(requestData.galleryPath, requestData.diffObj)
  ctx.body = { success: true }
}

export function updateTagVideos(ctx: Context): void {
  const requestData = ctx.request.body as { tagTitle: string; diffObj: IDiffObj }
  relationsUtils.updateTagVideos(requestData.tagTitle, requestData.diffObj)
  ctx.body = { success: true }
}
