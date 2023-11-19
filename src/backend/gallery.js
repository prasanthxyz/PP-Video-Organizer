import * as fs from 'fs'
import * as path from 'path'

export const isDirExisting = (dirPath) => {
  return fs.existsSync(dirPath)
}

export const getGalleryImagePaths = (galleryPath) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  return fs
    .readdirSync(galleryPath)
    .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
    .map((file) => path.join(galleryPath, file))
}
