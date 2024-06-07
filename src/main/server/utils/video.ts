import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import * as fs from 'fs'
import * as path from 'path'
import { IDiffObj, IVideo, IVideoData, IVideoModel } from '../../../types'
import * as dataUtils from './data'
import * as relationsUtils from './relations'
import * as vcsi from './vcsi'

export function getAllVideos(): IVideo[] {
  return dataUtils.data.videos.map((video: IVideoModel) => ({
    filePath: video.filePath,
    width: video.width,
    height: video.height,
    frameRate: video.frameRate,
    bitRate: video.bitRate,
    duration: video.duration,
    quality: video.quality,
    ...getVideoMetaData(video.filePath)
  }))
}

export function getVideoMetaData(videoPath: string): IVideoData {
  const videoName = path.basename(videoPath)
  const imgDir = path.join(path.dirname(videoPath), 'img')
  const tgpPath = path.join(imgDir, `${videoName}.jpg`)
  return {
    id: videoPath,
    isAvailable: fs.existsSync(videoPath),
    imgDir: imgDir,
    tgpPath: tgpPath,
    isTgpAvailable: fs.existsSync(tgpPath),
    videoName: videoName,

    tags: relationsUtils.getVideoTags(videoPath),
    galleries: relationsUtils.getVideoGalleries(videoPath)
  }
}

export function getVideoData(videoPath: string): IVideo {
  const videoModel: IVideoModel = dataUtils.data.videos.find(
    (v) => v.filePath === videoPath
  ) as IVideoModel
  return {
    ...videoModel,
    ...getVideoMetaData(videoPath)
  }
}

export async function addVideos(videoPaths: string[]): Promise<void> {
  const existingVideos = new Set(dataUtils.data.videos.map((v: IVideoModel) => v.filePath))
  const newVideos: IVideoModel[] = []
  for (const videoPath of videoPaths) {
    if (existingVideos.has(videoPath)) continue
    try {
      const videoInfo = await getVideoStream(videoPath)
      if (!videoInfo) continue
      if (
        [videoInfo.width, videoInfo.height, videoInfo.duration, videoInfo.duration_ts].some(
          (value) => Number.isNaN(Number(value))
        ) ||
        !videoInfo.duration_ts ||
        videoInfo.duration_ts < 1000
      )
        continue

      const video: IVideoModel = {
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

      await generateTgp(videoPath)
      newVideos.push(video)
    } catch (e) {
      continue
    }
  }

  dataUtils.data.videos.push(...newVideos)
  dataUtils.storeData()

  const galleryDiffObj: IDiffObj = {
    add: dataUtils.data.galleries,
    remove: []
  }
  for (const video of newVideos) {
    relationsUtils.updateVideoGalleries(video.filePath, galleryDiffObj)
  }
}

export function deleteVideo(videoPath: string): void {
  dataUtils.data.videos = dataUtils.data.videos.filter((video) => video.filePath !== videoPath)
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter((vg) => vg[0] !== videoPath)
  dataUtils.data.videoTags = dataUtils.data.videoTags.filter((vt) => vt[0] !== videoPath)
  dataUtils.storeData()
}

export function deleteMissingVideos(): void {
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
}

export async function generateTgp(videoPath: string): Promise<void> {
  if (!fs.existsSync(videoPath)) return

  const { imgDir, isTgpAvailable } = getVideoMetaData(videoPath)
  if (isTgpAvailable) return

  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir)
  }

  const videoStream = await getVideoStream(videoPath)
  if (videoStream === null) return
  await vcsi.generateTgp(videoPath, imgDir, Number(videoStream.duration), 4, 4, 1500)
}

export async function generateMissingTgps(): Promise<void> {
  for (const video of dataUtils.data.videos) {
    await generateTgp(video.filePath)
  }
}

async function getVideoStream(videoPath: string): Promise<ffprobe.FFProbeStream | null> {
  const data = await ffprobe(videoPath, { path: ffprobeStatic.path })
  const videoStream = data.streams.find(
    (stream: ffprobe.FFProbeStream) => stream.codec_type === 'video'
  )
  return videoStream || null
}
