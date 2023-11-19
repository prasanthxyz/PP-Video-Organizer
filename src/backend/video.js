import * as child_process from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { getVideos } from './db'

export const generateMissingTgps = async () => {
  const existingVideos = await getVideos()
  existingVideos.forEach((video) => {
    generateTgp(video.filePath)
  })
}

export const isTgpExisting = (videoPath) => {
  const [videoName, imgDir] = getVideoData(videoPath)
  if (!fs.existsSync(imgDir)) return false
  const imgFileName = path.join(imgDir, videoName + '.jpg')
  return fs.existsSync(imgFileName)
}

export const generateTgp = (videoPath, regenerate = false) => {
  const [videoName, imgDir] = getVideoData(videoPath)
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir)
  }

  const imgFileName = path.join(imgDir, videoName + '.jpg')
  if (fs.existsSync(imgFileName)) {
    if (!regenerate) return
    fs.unlinkSync(imgFileName)
  }

  child_process.execSync(
    `python -m vcsi.vcsi ${videoPath} -g 4x4 --metadata-font-size 0 -w 1500 -o ${imgDir}`,
    (error, _stdout, stderr) => {
      if (error) console.error(`error: ${error.message}`)
      if (stderr) console.error(`stderr: ${stderr}`)
    }
  )
}

const getVideoData = (videoPath) => {
  const imgDir = path.join(path.dirname(videoPath), 'img')
  return [path.basename(videoPath), imgDir]
}
