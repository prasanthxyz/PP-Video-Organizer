import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import * as fs from 'fs'
import * as path from 'path'
import * as db from './db'

import { execCommand, getPythonExecutable } from './utils'

export async function addVideos(videoPaths) {
  const existingVideos = new Set((await db.getVideos()).map((v) => v.filePath))
  const newVideos = []

  for (const videoPath of videoPaths) {
    if (existingVideos.has(videoPath)) continue
    try {
      const videoInfo = await getVideoStream(videoPath)
      if (
        [videoInfo.width, videoInfo.height, videoInfo.duration, videoInfo.duration_ts].some(
          isNaN
        ) ||
        videoInfo.duration_ts < 1000
      )
        continue

      const video = {
        filePath: videoPath,
        width: videoInfo.width,
        height: videoInfo.height,
        bitRate: parseFloat(videoInfo.bit_rate),
        duration: parseFloat(videoInfo.duration) / 60
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
}

export async function getAvailableVideos() {
  return (await db.getVideos())
    .map((v) => v.filePath)
    .filter((v) => {
      const videoData = getVideoData(v)
      return videoData.isAvailable && videoData.isTgpAvailable
    })
}

export async function getAllVideos() {
  return (await db.getVideos()).map((video) => ({
    ...video,
    ...getVideoData(video.filePath)
  }))
}

export async function getVideo(videoPath) {
  const dbVideoData = await db.getVideoData(videoPath)
  return {
    ...dbVideoData,
    ...getVideoData(videoPath)
  }
}

export async function deleteMissingVideos() {
  const allVideos = (await db.getVideos()).map((v) => v.filePath)
  const missingVideos = allVideos.filter((v) => !fs.existsSync(v))
  await db.deleteVideos(missingVideos)
}

export async function generateMissingTgps() {
  const existingVideos = await db.getVideos()
  await Promise.all(existingVideos.map((video) => generateTgp(video.filePath)))
}

export async function generateTgp(videoPath, regenerate = false) {
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
      `${pythonExecutable} -m vcsi.vcsi "${videoPath}" -g 4x4 --metadata-font-size 0 -w 1500 -o "${imgDir}"`,
      (error, _stdout, stderr) => {
        if (error) console.error(`error: ${error.message}`)
        if (stderr) console.error(`stderr: ${stderr}`)
      }
    )
  }
}

async function getVideoStream(videoPath) {
  const data = await ffprobe(videoPath, { path: ffprobeStatic.path })
  for (const stream of data['streams']) if (stream.codec_type === 'video') return stream
  return null
}

function getVideoData(videoPath) {
  const videoName = path.basename(videoPath)
  const imgDir = path.join(path.dirname(videoPath), 'img')
  const tgpPath = path.join(imgDir, videoName + '.jpg')

  return {
    id: videoPath,
    isAvailable: fs.existsSync(videoPath),
    tgpPath: tgpPath,
    isTgpAvailable: fs.existsSync(tgpPath),
    videoName: videoName,
    imgDir: imgDir
  }
}
