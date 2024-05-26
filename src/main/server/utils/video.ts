import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg'
import * as fs from 'fs'
import * as path from 'path'
import { IVideo, IVideoFull, IVideoModel } from '../../../types'
import * as dataUtils from './data'

export function getAllVideos(): IVideoFull[] {
  return dataUtils.data.videos.map((video: IVideoModel) => ({
    ...video,
    ...getVideoData(video.filePath)
  }))
}

export async function generateTgp(videoPath: string): Promise<void> {
  if (!fs.existsSync(videoPath)) return

  const { imgDir, isTgpAvailable } = getVideoData(videoPath)
  if (isTgpAvailable) return

  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir)
  }

  ffmpeg.setFfprobePath(ffprobeStatic.path)
  const metadata = await new Promise<FfprobeData>((resolve) => {
    ffmpeg.ffprobe(videoPath, (_err, metadata) => {
      resolve(metadata)
    })
  })
  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .output(`${imgDir}/${path.basename(videoPath)}.jpg`)
      .outputOptions('-vf', `fps=16/${metadata.format.duration},tile=4x4`)
      .on('end', () => resolve())
      .on('error', (err) => {
        return reject(new Error(err))
      })
      .run()
  })
}

export async function getVideoStream(videoPath: string): Promise<ffprobe.FFProbeStream | null> {
  const data = await ffprobe(videoPath, { path: ffprobeStatic.path })
  const videoStream = data.streams.find(
    (stream: ffprobe.FFProbeStream) => stream.codec_type === 'video'
  )
  return videoStream || null
}

export function getVideoData(videoPath: string): IVideo {
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
