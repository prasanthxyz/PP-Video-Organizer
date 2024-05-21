import { execSync as execCommand } from 'child_process'
import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import * as fs from 'fs'
import * as path from 'path'

import { getAllGalleries } from './gallery'
import { IVideo, IVideoFull, IVideoModel, IVideoWithRelated, IGallery, IDiffObj } from '../../types'
import * as db from './db'
import { getPythonExecutable } from './utils'

async function getVideoStream(videoPath: string): Promise<ffprobe.FFProbeStream | null> {
  const data = await ffprobe(videoPath, { path: ffprobeStatic.path })
  const videoStream = data.streams.find(
    (stream: ffprobe.FFProbeStream) => stream.codec_type === 'video'
  )
  return videoStream || null
}

export async function addVideos(videoPaths: string[]): Promise<void> {
  const existingVideos = new Set((await db.getVideos()).map((v: IVideoModel) => v.filePath))
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

      await generateTgp(videoPath)
      newVideos.push(video)
    } catch (e) {
      continue
    }
  }

  await db.createVideos(newVideos)

  const allGalleries = (await getAllGalleries()).map((gallery: IGallery) => gallery.galleryPath)
  const galleryDiffObj: IDiffObj = {
    add: allGalleries,
    remove: []
  }
  for (const video of newVideos) {
    await db.updateVideoGalleries(video.filePath, galleryDiffObj)
  }
}

function getVideoData(videoPath: string): IVideo {
  const videoName = path.basename(videoPath)
  const imgDir = path.join(path.dirname(videoPath), 'img')
  const tgpPath = path.join(imgDir, `${videoName}.jpg`)

  return {
    id: videoPath,
    isAvailable: fs.existsSync(videoPath),
    tgpPath,
    isTgpAvailable: fs.existsSync(tgpPath),
    videoName,
    imgDir
  }
}

export async function getAvailableVideos(): Promise<string[]> {
  return (await db.getVideos())
    .map((v: IVideoModel) => v.filePath)
    .filter((v: string) => {
      const videoData = getVideoData(v)
      return videoData.isAvailable && videoData.isTgpAvailable
    })
}

export async function getAllVideos(): Promise<IVideoFull[]> {
  return (await db.getVideos()).map((video: IVideoModel) => ({
    ...video,
    ...getVideoData(video.filePath)
  }))
}

export async function getVideo(videoPath: string): Promise<IVideoWithRelated> {
  const dbVideoData = await db.getVideoData(videoPath)
  return {
    ...dbVideoData,
    ...getVideoData(videoPath)
  }
}

export async function deleteMissingVideos(): Promise<void> {
  const allVideos = (await db.getVideos()).map((v: IVideoModel) => v.filePath)
  const missingVideos = allVideos.filter((v: string) => !fs.existsSync(v))
  await db.deleteVideos(missingVideos)
}

export async function generateTgp(videoPath: string, regenerate = false): Promise<void> {
  if (!fs.existsSync(videoPath)) return

  const { imgDir, tgpPath, isTgpAvailable } = getVideoData(videoPath)
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir)
  }
  if (isTgpAvailable) {
    if (!regenerate) return
    fs.unlinkSync(tgpPath)
  }

  const pythonExecutable = await getPythonExecutable()
  if (pythonExecutable !== '') {
    execCommand(
      `${pythonExecutable} -m vcsi.vcsi "${videoPath}" -g 4x4 --metadata-font-size 0 -w 1500 -o "${imgDir}"`
      // (error: Error, _stdout: any, stderr: any): void => {
      //   if (error) console.error(`error: ${error.message}`);
      //   if (stderr) console.error(`stderr: ${stderr}`);
      // },
    )
  }
}

export async function generateMissingTgps(): Promise<void> {
  const existingVideos = await db.getVideos()
  await Promise.all(existingVideos.map((video: IVideoModel) => generateTgp(video.filePath)))
}
