import * as fs from 'fs'
import * as path from 'path'
import { IGallery, IGalleryModel, IVideoModel } from '../../../types'
import * as dataUtils from './data'

export function getGalleries(): IGalleryModel[] {
  return dataUtils.data.galleries.map((gp) => ({
    galleryPath: gp
  }))
}

export function getAllGalleries(): IGallery[] {
  return getGalleries()
    .map((gallery: IGalleryModel) => ({
      ...gallery,
      id: gallery.galleryPath,
      galleryName: path.basename(gallery.galleryPath as string),
      isAvailable: fs.existsSync(gallery.galleryPath as string)
    }))
    .sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
}

export function getGalleryImagePaths(galleryPath: string): string[] {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  return fs
    .readdirSync(galleryPath)
    .filter((file) => file[0] != '.' && imageExtensions.includes(path.extname(file).toLowerCase()))
    .map((file) => path.join(galleryPath, file))
}

export function getGalleryData(galleryPath: string): { videos: IVideoModel[] } {
  const videoPaths = new Set(
    dataUtils.data.videoGalleries.filter((vg) => vg[1] === galleryPath).map((vg) => vg[0])
  )
  return {
    videos: dataUtils.data.videos.filter((video) => videoPaths.has(video.filePath))
  }
}
