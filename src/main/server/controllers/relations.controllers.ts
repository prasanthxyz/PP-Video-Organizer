import { Context } from 'koa'
import { IDiffObj, IGalleryModel, ITagModel, IVideoModel } from '../../../types'
import * as dataUtils from '../utils/data'
import * as relationsUtils from '../utils/relations'

export function getCombinationsData(ctx: Context): void {
  const requestData = ctx.request.body as {
    videoPaths: string[]
    tagsSet: string[]
    galleriesSet: string[]
  }
  const videoPathsSet = new Set(requestData.videoPaths)
  const tagsSet = new Set(requestData.tagsSet)
  const galleriesSet = new Set(requestData.galleriesSet)

  const videos = dataUtils.data.videos
    .filter((video) => videoPathsSet.has(video.filePath))
    .map((v: IVideoModel) => {
      const videoData = relationsUtils.getVideoRelations(v.filePath)
      return {
        videoPath: v.filePath,
        videoTags: videoData.tags.map((t: ITagModel) => t.title),
        videoGalleries: videoData.galleries.map((g: IGalleryModel) => g.galleryPath)
      }
    })

  const combinationsData: [string, string][] = []
  for (const { videoPath, videoTags, videoGalleries } of videos) {
    const commonGalleries = videoGalleries.filter((gallery) => galleriesSet.has(gallery))
    if (commonGalleries.length === 0) continue

    const commonTags = videoTags.filter((tag) => tagsSet.has(tag))
    if (commonTags.length !== tagsSet.size) continue

    for (const gallery of commonGalleries) {
      combinationsData.push([videoPath, gallery])
    }
  }

  ctx.body = combinationsData
}

export function updateVideoGalleries(ctx: Context): void {
  const requestData = ctx.request.body as { videoPath: string; diffObj: IDiffObj }
  const videoPath = requestData.videoPath
  const diffObj = requestData.diffObj
  relationsUtils.updateVideoGalleries(videoPath, diffObj)
  ctx.body = { success: true }
}

export function updateVideoTags(ctx: Context): void {
  const requestData = ctx.request.body as { videoPath: string; diffObj: IDiffObj }
  const videoPath = requestData.videoPath
  const diffObj = requestData.diffObj
  const tagsToRemove = new Set(diffObj.remove)
  dataUtils.data.videoTags = dataUtils.data.videoTags.filter(
    ([vp, tt]) => vp !== videoPath || !tagsToRemove.has(tt)
  )
  for (const tagTitle of diffObj.add) {
    dataUtils.data.videoTags.push([videoPath, tagTitle])
  }
  dataUtils.storeData()
  ctx.body = { success: true }
}

export function updateGalleryVideos(ctx: Context): void {
  const requestData = ctx.request.body as { galleryPath: string; diffObj: IDiffObj }
  const galleryPath = requestData.galleryPath
  const diffObj = requestData.diffObj
  const videosToRemove = new Set(diffObj.remove)
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter(
    ([vp, gp]) => gp !== galleryPath || !videosToRemove.has(vp)
  )
  for (const videoPath of diffObj.add) {
    dataUtils.data.videoGalleries.push([videoPath, galleryPath])
  }
  dataUtils.storeData()
  ctx.body = { success: true }
}

export function updateTagVideos(ctx: Context): void {
  const requestData = ctx.request.body as { tagTitle: string; diffObj: IDiffObj }
  const tagTitle = requestData.tagTitle
  const diffObj = requestData.diffObj
  const videosToRemove = new Set(diffObj.remove)
  dataUtils.data.videoTags = dataUtils.data.videoTags.filter(
    ([vp, tt]) => tt !== tagTitle || !videosToRemove.has(vp)
  )
  for (const videoPath of diffObj.add) {
    dataUtils.data.videoTags.push([videoPath, tagTitle])
  }
  dataUtils.storeData()
  ctx.body = { success: true }
}
