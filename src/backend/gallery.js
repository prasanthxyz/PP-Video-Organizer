import * as fs from 'fs'
import _ from 'lodash'
import * as path from 'path'
import * as db from './db'

export async function deleteMissingGalleries() {
  const allGalleries = (await db.getGalleries()).map((g) => g.galleryPath)
  const missingGalleries = allGalleries.filter((g) => !fs.existsSync(g))
  await db.deleteGalleries(missingGalleries)
}

export async function getAvailableGalleries() {
  return (await db.getGalleries()).map((g) => g.galleryPath).filter(fs.existsSync)
}

export async function getAllGalleries() {
  return (await db.getGalleries()).map((gallery) => ({
    ...gallery,
    id: gallery.galleryPath,
    galleryName: path.basename(gallery.galleryPath),
    isAvailable: fs.existsSync(gallery.galleryPath)
  }))
}

export async function getGallery(galleryPath) {
  const galleryData = await db.getGalleryData(galleryPath)
  return {
    ...galleryData,
    id: galleryPath,
    galleryPath: galleryPath,
    galleryName: path.basename(galleryPath),
    isAvailable: fs.existsSync(galleryPath),
    images: _.shuffle(
      getGalleryImagePaths(galleryPath).map((i) => 'file:///' + i.replace(/\\/g, '/'))
    )
  }
}

function getGalleryImagePaths(galleryPath) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  return fs
    .readdirSync(galleryPath)
    .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
    .map((file) => path.join(galleryPath, file))
}
