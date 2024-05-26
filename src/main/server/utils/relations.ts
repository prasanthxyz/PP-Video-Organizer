import { IDiffObj, IGalleryModel, ITagModel } from '../../../types'
import * as dataUtils from './data'

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

export function getVideoRelations(videoPath: string): {
  tags: ITagModel[]
  galleries: IGalleryModel[]
} {
  return {
    tags: dataUtils.data.videoTags
      .filter((vt) => vt[0] === videoPath)
      .map((vt) => ({ title: vt[1] })),
    galleries: dataUtils.data.videoGalleries
      .filter((vg) => vg[0] === videoPath)
      .map((vg) => ({ galleryPath: vg[1] }))
  }
}
