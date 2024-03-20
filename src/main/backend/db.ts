import { IDiffObj, IGalleryModel, ITagModel, IVideoModel } from '../../types'
import { data, storeData } from '../database'

export async function deleteVideo(videoPath: string): Promise<void> {
  data.videos = data.videos.filter((video) => video.filePath !== videoPath)
  data.videoGalleries = data.videoGalleries.filter((vg) => vg[0] !== videoPath)
  data.videoTags = data.videoTags.filter((vt) => vt[0] !== videoPath)
  storeData()
}

export async function deleteVideos(videoPaths: string[]): Promise<void> {
  const videoPathsSet = new Set(videoPaths)
  data.videos = data.videos.filter((video) => !videoPathsSet.has(video.filePath))
  data.videoGalleries = data.videoGalleries.filter((vg) => !videoPathsSet.has(vg[0]))
  data.videoTags = data.videoTags.filter((vt) => !videoPathsSet.has(vt[0]))
  storeData()
}

export async function deleteTag(tagTitle: string): Promise<void> {
  data.tags = data.tags.filter((tag) => tag !== tagTitle)
  data.videoTags = data.videoTags.filter((vt) => vt[1] !== tagTitle)
  storeData()
}

export async function deleteGallery(galleryPath: string): Promise<void> {
  data.galleries = data.galleries.filter((gp) => gp !== galleryPath)
  data.videoGalleries = data.videoGalleries.filter((vg) => vg[1] !== galleryPath)
  storeData()
}

export async function deleteGalleries(galleryPaths: string[]): Promise<void> {
  const galleryPathsSet = new Set(galleryPaths)
  data.galleries = data.galleries.filter((gp) => !galleryPathsSet.has(gp))
  data.videoGalleries = data.videoGalleries.filter((vg) => !galleryPathsSet.has(vg[1]))
  storeData()
}

export async function getVideos(): Promise<IVideoModel[]> {
  return data.videos
}

export async function getTags(): Promise<ITagModel[]> {
  return data.tags.map((tt) => ({
    title: tt
  }))
}

export async function getGalleries(): Promise<IGalleryModel[]> {
  return data.galleries.map((gp) => ({
    galleryPath: gp
  }))
}

export async function createVideos(videos: IVideoModel[]): Promise<void> {
  data.videos.push(...videos)
  storeData()
}

export async function createTags(tagTitles: string): Promise<void> {
  const existingTags = new Set((await getTags()).map((t: ITagModel) => t.title))
  const validTags = tagTitles
    .toLowerCase()
    .split(' ')
    .map((tagTitle) => tagTitle.trim())
    .filter((tagTitle) => tagTitle !== '' && !existingTags.has(tagTitle))
  data.tags.push(...validTags)
  storeData()
}

export async function createGallery(galleryPath: string): Promise<void> {
  const existingGalleries = new Set((await getGalleries()).map((g: IGalleryModel) => g.galleryPath))
  if (existingGalleries.has(galleryPath)) return
  data.galleries.push(galleryPath)
  storeData()
}

export async function getVideoData(videoPath: string): Promise<{
  tags: ITagModel[]
  galleries: IGalleryModel[]
}> {
  return {
    tags: data.videoTags.filter((vt) => vt[0] === videoPath).map((vt) => ({ title: vt[1] })),
    galleries: data.videoGalleries
      .filter((vg) => vg[0] === videoPath)
      .map((vg) => ({ galleryPath: vg[1] }))
  }
}

export async function getGalleryData(galleryPath: string): Promise<{ videos: IVideoModel[] }> {
  const videoPaths = new Set(
    data.videoGalleries.filter((vg) => vg[1] === galleryPath).map((vg) => vg[0])
  )
  return {
    videos: data.videos.filter((video) => videoPaths.has(video.filePath))
  }
}

export async function getTagData(tagTitle: string): Promise<{ videos: IVideoModel[] }> {
  const videoPaths = new Set(data.videoTags.filter((vt) => vt[1] === tagTitle).map((vt) => vt[0]))
  return {
    videos: data.videos.filter((video) => videoPaths.has(video.filePath))
  }
}

export async function updateVideoTags(videoPath: string, diffObj: IDiffObj): Promise<void> {
  const tagsToRemove = new Set(diffObj.remove)
  data.videoTags = data.videoTags.filter(([vp, tt]) => vp !== videoPath || !tagsToRemove.has(tt))
  for (const tagTitle of diffObj.add) {
    data.videoTags.push([videoPath, tagTitle])
  }
  storeData()
}

export async function updateVideoGalleries(videoPath: string, diffObj: IDiffObj): Promise<void> {
  const galleriesToRemove = new Set(diffObj.remove)
  data.videoGalleries = data.videoGalleries.filter(
    ([vp, gp]) => vp !== videoPath || !galleriesToRemove.has(gp)
  )
  for (const galleryPath of diffObj.add) {
    data.videoGalleries.push([videoPath, galleryPath])
  }
  storeData()
}

export async function updateGalleryVideos(galleryPath: string, diffObj: IDiffObj): Promise<void> {
  const videosToRemove = new Set(diffObj.remove)
  data.videoGalleries = data.videoGalleries.filter(
    ([vp, gp]) => gp !== galleryPath || !videosToRemove.has(vp)
  )
  for (const videoPath of diffObj.add) {
    data.videoGalleries.push([videoPath, galleryPath])
  }
  storeData()
}

export async function updateTagVideos(tagTitle: string, diffObj: IDiffObj): Promise<void> {
  const videosToRemove = new Set(diffObj.remove)
  data.videoTags = data.videoTags.filter(([vp, tt]) => tt !== tagTitle || !videosToRemove.has(vp))
  for (const videoPath of diffObj.add) {
    data.videoTags.push([videoPath, tagTitle])
  }
  storeData()
}

export async function getSelectedVideos(videoPaths: string[]): Promise<
  {
    videoPath: string
    videoTags: string[]
    videoGalleries: string[]
  }[]
> {
  const videoPathsSet = new Set(videoPaths)
  const videoObjs: IVideoModel[] = data.videos.filter((video) => videoPathsSet.has(video.filePath))
  return Promise.all(
    videoObjs.map(async (v: IVideoModel) => {
      const videoData = await getVideoData(v.filePath)
      return {
        videoPath: v.filePath,
        videoTags: videoData.tags.map((t: ITagModel) => t.title),
        videoGalleries: videoData.galleries.map((g: IGalleryModel) => g.galleryPath)
      }
    })
  )
}
