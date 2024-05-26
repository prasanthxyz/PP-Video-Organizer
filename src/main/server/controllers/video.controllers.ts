import * as fs from 'fs'
import { Context } from 'koa'
import { IDiffObj, IGallery, IVideoModel } from '../../../types'
import * as dataUtils from '../utils/data'
import * as galleryUtils from '../utils/gallery'
import * as relationsUtils from '../utils/relations'
import * as videoUtils from '../utils/video'

export function getAvailableVideos(ctx: Context): void {
  ctx.body = dataUtils.data.videos
    .map((v: IVideoModel) => v.filePath)
    .filter((v: string) => {
      const videoData = videoUtils.getVideoData(v)
      return videoData.isAvailable && videoData.isTgpAvailable
    })
}

export function getAllVideos(ctx: Context): void {
  ctx.body = dataUtils.data.videos.map((video: IVideoModel) => ({
    ...video,
    ...videoUtils.getVideoData(video.filePath)
  }))
}

export function getVideo(ctx: Context): void {
  const requestData = ctx.request.body as { videoPath: string }
  const videoPath = requestData.videoPath
  ctx.body = {
    ...videoUtils.getVideoData(videoPath),
    ...relationsUtils.getVideoRelations(videoPath)
  }
}

export async function addVideos(ctx: Context): Promise<void> {
  const requestData = ctx.request.body as { videoPaths: string[] }
  const videoPaths = requestData.videoPaths

  const existingVideos = new Set(dataUtils.data.videos.map((v: IVideoModel) => v.filePath))
  const newVideos: IVideoModel[] = []
  for (const videoPath of videoPaths) {
    if (existingVideos.has(videoPath)) continue
    try {
      const videoInfo = await videoUtils.getVideoStream(videoPath)
      if (!videoInfo) continue
      if (
        [videoInfo.width, videoInfo.height, videoInfo.duration, videoInfo.duration_ts].some(
          (value) => Number.isNaN(Number(value))
        ) ||
        !videoInfo.duration_ts ||
        videoInfo.duration_ts < 1000
      )
        continue

      const video = {
        filePath: videoPath,
        width: videoInfo.width || 0,
        height: videoInfo.height || 0,
        bitRate: parseFloat(String(videoInfo.bit_rate || 0)),
        duration: parseFloat(String(videoInfo.duration || 0)) / 60,
        frameRate: 0,
        quality: 0
      }
      const [num, den] = videoInfo['avg_frame_rate'].split('/').map(parseFloat)
      video.frameRate = num / den
      // QUALITY METRIC
      // normalize width*height to 640 x 480, framerate to 30, and get corresponding bit-rate
      video.quality =
        (video.bitRate * ((video.width * video.height) / (640 * 480))) / (video.frameRate / 30)

      await videoUtils.generateTgp(videoPath)
      newVideos.push(video)
    } catch (e) {
      continue
    }
  }

  dataUtils.data.videos.push(...newVideos)
  dataUtils.storeData()

  const allGalleries = galleryUtils
    .getAllGalleries()
    .map((gallery: IGallery) => gallery.galleryPath)
  const galleryDiffObj: IDiffObj = {
    add: allGalleries,
    remove: []
  }
  for (const video of newVideos) {
    relationsUtils.updateVideoGalleries(video.filePath, galleryDiffObj)
  }

  ctx.body = { success: true }
}

export function deleteVideo(ctx: Context): void {
  const requestData = ctx.request.body as { videoPath: string }
  const videoPath = requestData.videoPath
  dataUtils.data.videos = dataUtils.data.videos.filter((video) => video.filePath !== videoPath)
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter((vg) => vg[0] !== videoPath)
  dataUtils.data.videoTags = dataUtils.data.videoTags.filter((vt) => vt[0] !== videoPath)
  dataUtils.storeData()
  ctx.body = { success: true }
}

export function deleteMissingVideos(ctx: Context): void {
  const allVideos = dataUtils.data.videos.map((v: IVideoModel) => v.filePath)
  const missingVideos = new Set(allVideos.filter((v: string) => !fs.existsSync(v)))
  dataUtils.data.videos = dataUtils.data.videos.filter(
    (video) => !missingVideos.has(video.filePath)
  )
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter(
    (vg) => !missingVideos.has(vg[0])
  )
  dataUtils.data.videoTags = dataUtils.data.videoTags.filter((vt) => !missingVideos.has(vt[0]))
  dataUtils.storeData()
  ctx.body = { success: true }
}

export async function generateTgp(ctx: Context): Promise<void> {
  const requestData = ctx.request.body as { videoPath: string }
  const videoPath = requestData.videoPath
  await videoUtils.generateTgp(videoPath)
  ctx.body = { success: true }
}

export async function generateMissingTgps(ctx: Context): Promise<void> {
  await Promise.all(
    dataUtils.data.videos.map((video: IVideoModel) => videoUtils.generateTgp(video.filePath))
  )
  ctx.body = { success: true }
}
