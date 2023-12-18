import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import * as fs from 'fs'
import * as path from 'path'
import * as db from './db'

import { execCommand, isCommandExisting } from './utils'

export const addVideos = async (videoPaths) => {
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

export const getAvailableVideos = async () => {
  return (await db.getVideos()).map((v) => v.filePath).filter(isFileExisting)
}

export const getAllVideos = async () => {
  return (await db.getVideos()).map((video) => ({
    ...video,
    id: video.filePath,
    isAvailable: isFileExisting(video.filePath),
    isTgpAvailable: isTgpExisting(video.filePath)
  }))
}

export const deleteMissingVideos = async () => {
  const allVideos = (await db.getVideos()).map((v) => v.filePath)
  const missingVideos = allVideos.filter((v) => !isFileExisting(v))
  await db.deleteVideos(missingVideos)
}

export const generateMissingTgps = async () => {
  const existingVideos = await db.getVideos()
  existingVideos.forEach((video) => {
    generateTgp(video.filePath)
  })
}

export const isFileExisting = (videoPath) => {
  return fs.existsSync(videoPath)
}

export const isTgpExisting = (videoPath) => {
  const [videoName, imgDir] = getVideoData(videoPath)
  if (!fs.existsSync(imgDir)) return false
  const imgFileName = path.join(imgDir, videoName + '.jpg')
  return fs.existsSync(imgFileName)
}

export const generateTgp = async (videoPath, regenerate = false) => {
  if (!isFileExisting(videoPath)) return
  const [videoName, imgDir] = getVideoData(videoPath)
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir)
  }

  const imgFileName = path.join(imgDir, videoName + '.jpg')
  if (fs.existsSync(imgFileName)) {
    if (!regenerate) return
    fs.unlinkSync(imgFileName)
  }

  const pythonExecutable = (await isCommandExisting('python'))
    ? 'python'
    : (await isCommandExisting('python3'))
      ? 'python3'
      : (await isCommandExisting('py'))
        ? 'py'
        : ''
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

const getVideoStream = async (videoPath) => {
  const data = await ffprobe(videoPath, { path: ffprobeStatic.path })
  for (const stream of data['streams']) if (stream.codec_type === 'video') return stream
  return null
}

const getVideoData = (videoPath) => {
  const imgDir = path.join(path.dirname(videoPath), 'img')
  return [path.basename(videoPath), imgDir]
}
