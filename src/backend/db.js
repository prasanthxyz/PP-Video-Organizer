import { Op } from 'sequelize'
import { Gallery, Tag, Video } from '../main/database/database'

export const deleteVideo = async (videoPath) => {
  await Video.destroy({ where: { filePath: videoPath } })
}

export const deleteVideos = async (videoPaths) => {
  await Video.destroy({ where: { filePath: { [Op.in]: videoPaths } } })
}

export const deleteTag = async (tagTitle) => {
  await Tag.destroy({ where: { title: tagTitle } })
}

export const deleteGallery = async (galleryPath) => {
  await Gallery.destroy({ where: { galleryPath: galleryPath } })
}

export const deleteGalleries = async (galleryPaths) => {
  await Gallery.destroy({ where: { galleryPath: { [Op.in]: galleryPaths } } })
}

export const getVideos = async () => {
  return await Video.findAll({ raw: true })
}

export const getTags = async () => {
  return await Tag.findAll({ raw: true })
}

export const getGalleries = async () => {
  return await Gallery.findAll({ raw: true })
}

export const createVideos = async (videoPaths) => {
  const existingVideos = new Set((await getVideos()).map((v) => v.filePath))
  const validVideos = videoPaths
    .filter((videoPath) => !existingVideos.has(videoPath))
    .map((videoPath) => ({
      filePath: videoPath
    }))
  Video.bulkCreate(validVideos)
}

export const createTags = async (tagTitles) => {
  const existingTags = new Set((await getTags()).map((t) => t.title))
  const validTags = tagTitles
    .toLowerCase()
    .split(' ')
    .map((tagTitle) => tagTitle.trim())
    .filter((tagTitle) => tagTitle !== '' && !existingTags.has(tagTitle))
    .map((tagTitle) => ({ title: tagTitle }))
  Tag.bulkCreate(validTags)
}

export const createGallery = async (galleryPath) => {
  const existingGalleries = new Set((await getGalleries()).map((v) => v.galleryPath))
  if (existingGalleries.has(galleryPath)) return
  await Gallery.create({ galleryPath: galleryPath })
}

export const getVideoData = async (videoPath) => {
  const videoObj = await Video.findOne({
    where: { filePath: videoPath },
    include: [Tag, Gallery]
  })
  return {
    tags: await videoObj.getTags({ raw: true }),
    galleries: await videoObj.getGalleries({ raw: true })
  }
}

export const updateVideoTags = async (videoPath, updateObj) => {
  const videoObj = await Video.findOne({ where: { filePath: videoPath } })
  await videoObj.addTags(updateObj['add'])
  await videoObj.removeTags(updateObj['remove'])
}

export const updateVideoGalleries = async (videoPath, updateObj) => {
  const videoObj = await Video.findOne({ where: { filePath: videoPath } })
  await videoObj.addGalleries(updateObj['add'])
  await videoObj.removeGalleries(updateObj['remove'])
}

export const getCombinationsData = async (videoPaths, tags, galleries) => {
  const tagsSet = new Set(tags)
  const galleriesSet = new Set(galleries)
  const videos = await Video.findAll({
    where: { filePath: { [Op.in]: videoPaths } },
    include: [Tag, Gallery]
  })
  const combinationsData = []
  for (const video of videos) {
    const videoGalleries = (await video.getGalleries()).map((gallery) => gallery.galleryPath)
    const commonGalleries = new Set(videoGalleries.filter((gallery) => galleriesSet.has(gallery)))
    if (commonGalleries.size === 0) continue

    const videoTags = (await video.getTags()).map((tag) => tag.title)
    const commonTags = new Set(videoTags.filter((tag) => tagsSet.has(tag)))
    if (commonTags.size !== tagsSet.size) continue
    for (const gallery of commonGalleries) {
      combinationsData.push([video.filePath, gallery])
    }
  }
  return combinationsData
}
