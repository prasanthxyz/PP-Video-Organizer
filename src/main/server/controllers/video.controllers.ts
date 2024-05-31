import { Context } from 'koa'
import { IVideo } from '../../../types'
import * as videoUtils from '../utils/video'

export function getAllVideos(ctx: Context): void {
  const allVideos: IVideo[] = videoUtils.getAllVideos()
  ctx.body = allVideos
}

export function getVideo(ctx: Context): void {
  const requestData = ctx.request.body as { videoPath: string }
  const video: IVideo = videoUtils.getVideoData(requestData.videoPath)
  ctx.body = video
}

export async function addVideos(ctx: Context): Promise<void> {
  const requestData = ctx.request.body as { videoPaths: string[] }
  await videoUtils.addVideos(requestData.videoPaths)
  ctx.body = { success: true }
}

export function deleteVideo(ctx: Context): void {
  const requestData = ctx.request.body as { videoPath: string }
  videoUtils.deleteVideo(requestData.videoPath)
  ctx.body = { success: true }
}

export function deleteMissingVideos(ctx: Context): void {
  videoUtils.deleteMissingVideos()
  ctx.body = { success: true }
}

export async function generateTgp(ctx: Context): Promise<void> {
  const requestData = ctx.request.body as { videoPath: string }
  await videoUtils.generateTgp(requestData.videoPath)
  ctx.body = { success: true }
}

export async function generateMissingTgps(ctx: Context): Promise<void> {
  await videoUtils.generateMissingTgps()
  ctx.body = { success: true }
}
