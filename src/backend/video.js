import * as child_process from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

export const isTgpExisting = (videoPath, type) => {
  const [videoName, imgDir] = getVideoData(videoPath, type)
  if (!fs.existsSync(imgDir)) return false
  const imgFileName = path.join(imgDir, videoName + '.jpg')
  return fs.existsSync(imgFileName)
}

export const generateTgp = (videoPath, type, regenerate = false) => {
  const [videoName, imgDir] = getVideoData(videoPath, type)
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir)
  }

  const imgFileName = path.join(imgDir, videoName + '.jpg')
  if (fs.existsSync(imgFileName)) {
    if (!regenerate) return
    fs.unlinkSync(imgFileName)
  }

  const gridSize = type === 'pc' ? '4x4' : '2x7'

  child_process.exec(
    `python -m vcsi.vcsi ${videoPath} -g ${gridSize} --metadata-font-size 0 -w 1500 -o ${imgDir}`,
    (error, _stdout, stderr) => {
      if (error) console.error(`error: ${error.message}`)
      if (stderr) console.error(`stderr: ${stderr}`)
    }
  )
}

const getVideoData = (videoPath, type) => {
  const imgDirName = type === 'pc' ? 'img' : 'img_phone'
  const imgDir = path.join(path.dirname(videoPath), imgDirName)
  return [path.basename(videoPath), imgDir]
}
