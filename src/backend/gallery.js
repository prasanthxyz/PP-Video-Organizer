import * as fs from 'fs'
import * as path from 'path'
import * as db from './db'

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

export const deleteMissingGalleries = async () => {
  const allGalleries = (await db.getGalleries()).map((g) => g.galleryPath)
  const missingGalleries = allGalleries.filter((g) => !isDirExisting(g))
  await db.deleteGalleries(missingGalleries)
}

export const getAvailableGalleries = async () => {
  return (await db.getGalleries()).map((g) => g.galleryPath).filter(isDirExisting)
}
