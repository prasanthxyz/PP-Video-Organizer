import * as fs from 'fs'
import _ from 'lodash'
import * as path from 'path'
import { IGallery, IGalleryFull, IGalleryModel } from '../../types'
import * as db from './db'

export async function deleteMissingGalleries(): Promise<void> {
  const allGalleries: string[] = (await db.getGalleries()).map(
    (g: IGalleryModel) => g.galleryPath
  ) as string[]
  const missingGalleries = allGalleries.filter((g: string) => !fs.existsSync(g))
  await db.deleteGalleries(missingGalleries)
}

export async function getAvailableGalleries(): Promise<string[]> {
  return (await db.getGalleries())
    .map((g: IGalleryModel) => g.galleryPath as string)
    .filter(fs.existsSync)
    .sort((a, b) => (a > b ? 1 : b > a ? -1 : 0))
}

export async function getAllGalleries(): Promise<IGallery[]> {
  return (await db.getGalleries())
    .map((gallery: IGalleryModel) => ({
      ...gallery,
      id: gallery.galleryPath,
      galleryName: path.basename(gallery.galleryPath as string),
      isAvailable: fs.existsSync(gallery.galleryPath as string)
    }))
    .sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
}

function getGalleryImagePaths(galleryPath: string): string[] {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  return fs
    .readdirSync(galleryPath)
    .filter((file) => file[0] != '.' && imageExtensions.includes(path.extname(file).toLowerCase()))
    .map((file) => path.join(galleryPath, file))
}

export async function getGallery(galleryPath: string): Promise<IGalleryFull> {
  const galleryData = await db.getGalleryData(galleryPath)
  return {
    ...galleryData,
    id: galleryPath,
    galleryPath,
    galleryName: path.basename(galleryPath),
    isAvailable: fs.existsSync(galleryPath),
    images: _.shuffle(
      getGalleryImagePaths(galleryPath).map((i) => `file:///${i.replace(/\\/g, '/')}`)
    )
  }
}
