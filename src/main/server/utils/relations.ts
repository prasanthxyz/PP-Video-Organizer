import { IDiffObj } from '../../../types'
import * as dataUtils from './data'

export function getVideoGalleries(videoPath: string): string[] {
  return dataUtils.data.videoGalleries.filter((vg) => vg[0] === videoPath).map((vg) => vg[1])
}

export function getVideoTags(videoPath: string): string[] {
  return dataUtils.data.videoTags.filter((vt) => vt[0] === videoPath).map((vt) => vt[1])
}

export function getGalleryVideos(galleryPath: string): string[] {
  return dataUtils.data.videoGalleries.filter((vg) => vg[1] === galleryPath).map((vg) => vg[0])
}

export function getTagVideos(tagTitle: string): string[] {
  return dataUtils.data.videoTags.filter((vt) => vt[1] === tagTitle).map((vt) => vt[0])
}

export function updateVideoGalleries(videoPath: string, diffObj: IDiffObj): void {
  const galleriesToRemove = new Set(diffObj.remove)
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter(
    ([vp, gp]) => vp !== videoPath || !galleriesToRemove.has(gp)
  )
  for (const galleryPath of diffObj.add) {
    dataUtils.data.videoGalleries.push([videoPath, galleryPath])
  }
  dataUtils.storeData()
}

export function updateVideoTags(videoPath: string, diffObj: IDiffObj): void {
  const tagsToRemove = new Set(diffObj.remove)
  dataUtils.data.videoTags = dataUtils.data.videoTags.filter(
    ([vp, tt]) => vp !== videoPath || !tagsToRemove.has(tt)
  )
  for (const tagTitle of diffObj.add) {
    dataUtils.data.videoTags.push([videoPath, tagTitle])
  }
  dataUtils.storeData()
}

export function updateGalleryVideos(galleryPath: string, diffObj: IDiffObj): void {
  const videosToRemove = new Set(diffObj.remove)
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter(
    ([vp, gp]) => gp !== galleryPath || !videosToRemove.has(vp)
  )
  for (const videoPath of diffObj.add) {
    dataUtils.data.videoGalleries.push([videoPath, galleryPath])
  }
  dataUtils.storeData()
}

export function updateTagVideos(tagTitle: string, diffObj: IDiffObj): void {
  const videosToRemove = new Set(diffObj.remove)
  dataUtils.data.videoTags = dataUtils.data.videoTags.filter(
    ([vp, tt]) => tt !== tagTitle || !videosToRemove.has(vp)
  )
  for (const videoPath of diffObj.add) {
    dataUtils.data.videoTags.push([videoPath, tagTitle])
  }
  dataUtils.storeData()
}
