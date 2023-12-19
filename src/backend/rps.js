import * as db from './db'

export async function getCombinationsData(videoPaths, tagsSet, galleriesSet) {
  const videos = await db.getSelectedVideos([...videoPaths])
  const combinationsData = []
  for (const { videoPath, videoTags, videoGalleries } of videos) {
    const commonGalleries = videoGalleries.filter((gallery) => galleriesSet.has(gallery))
    if (commonGalleries.length === 0) continue

    const commonTags = videoTags.filter((tag) => tagsSet.has(tag))
    if (commonTags.length !== tagsSet.size) continue

    for (const gallery of commonGalleries) {
      combinationsData.push([videoPath, gallery])
    }
  }
  return combinationsData
}
