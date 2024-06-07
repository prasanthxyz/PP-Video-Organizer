import * as fs from 'fs'
import * as path from 'path'
import { IDiffObj, IGallery, IVideoModel } from '../../../types'
import * as dataUtils from './data'
import * as relationsUtils from './relations'

export function getAllGalleries(): IGallery[] {
  return dataUtils.data.galleries
    .map(getGalleryData)
    .sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
}

export function getGalleryData(galleryPath: string): IGallery {
  const isGalleryAvailable = fs.existsSync(galleryPath)
  return {
    id: galleryPath,
    galleryPath: galleryPath,
    isAvailable: isGalleryAvailable,
    galleryName: path.basename(galleryPath),
    images: isGalleryAvailable ? getGalleryImagePaths(galleryPath) : [],
    videos: relationsUtils.getGalleryVideos(galleryPath)
  }
}

export function createGallery(galleryPath: string): void {
  const existingGalleries = new Set(dataUtils.data.galleries)
  if (existingGalleries.has(galleryPath)) return
  dataUtils.data.galleries.push(galleryPath)
  dataUtils.storeData()

  const videoDiffObj: IDiffObj = {
    add: dataUtils.data.videos.map((video: IVideoModel) => video.filePath),
    remove: []
  }
  relationsUtils.updateGalleryVideos(galleryPath, videoDiffObj)
}

export function deleteGallery(galleryPath: string): void {
  dataUtils.data.galleries = dataUtils.data.galleries.filter((gp) => gp !== galleryPath)
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter(
    (vg) => vg[1] !== galleryPath
  )
  dataUtils.storeData()
}

export function deleteMissingGalleries(): void {
  const missingGalleries = new Set(
    dataUtils.data.galleries.filter((gp: string) => !fs.existsSync(gp))
  )
  dataUtils.data.galleries = dataUtils.data.galleries.filter((gp) => !missingGalleries.has(gp))
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter(
    (vg) => !missingGalleries.has(vg[1])
  )
  dataUtils.storeData()
}

function getGalleryImagePaths(galleryPath: string): string[] {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  return fs
    .readdirSync(galleryPath)
    .filter((file) => file[0] != '.' && imageExtensions.includes(path.extname(file).toLowerCase()))
    .map((file) => path.join(galleryPath, file))
}
