import * as fs from 'fs'
import * as path from 'path'
import * as db from './db'
import { execCommand, isCommandExisting } from './utils'

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

const getVideoData = (videoPath) => {
  const imgDir = path.join(path.dirname(videoPath), 'img')
  return [path.basename(videoPath), imgDir]
}
