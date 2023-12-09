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

export const createVideos = async (videos) => {
  await Video.bulkCreate(videos)
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

export const getGalleryData = async (galleryPath) => {
  const galleryObj = await Gallery.findOne({
    where: { galleryPath: galleryPath },
    include: [Video]
  })
  return {
    videos: await galleryObj.getVideos({ raw: true })
  }
}

export const getTagData = async (tagTitle) => {
  const tagObj = await Tag.findOne({
    where: { title: tagTitle },
    include: [Video]
  })
  return {
    videos: await tagObj.getVideos({ raw: true })
  }
}

export const updateVideoTags = async (videoPath, diffObj) => {
  const videoObj = await Video.findOne({ where: { filePath: videoPath } })
  await videoObj.addTags(diffObj['add'])
  await videoObj.removeTags(diffObj['remove'])
}

export const updateVideoGalleries = async (videoPath, diffObj) => {
  const videoObj = await Video.findOne({ where: { filePath: videoPath } })
  await videoObj.addGalleries(diffObj['add'])
  await videoObj.removeGalleries(diffObj['remove'])
}

export const updateGalleryVideos = async (galleryPath, diffObj) => {
  const galleryObj = await Gallery.findOne({ where: { galleryPath: galleryPath } })
  await galleryObj.addVideos(diffObj['add'])
  await galleryObj.removeVideos(diffObj['remove'])
}

export const updateTagVideos = async (tagTitle, diffObj) => {
  const tagObj = await Tag.findOne({ where: { title: tagTitle } })
  await tagObj.addVideos(diffObj['add'])
  await tagObj.removeVideos(diffObj['remove'])
}

export const getSelectedVideos = async (videoPaths) => {
  const videoObjs = await Video.findAll({
    where: { filePath: { [Op.in]: videoPaths } },
    include: [Tag, Gallery]
  })
  return await Promise.all(
    videoObjs.map(async (v) => ({
      videoPath: v.filePath,
      videoTags: (await v.getTags()).map((t) => t.title),
      videoGalleries: (await v.getGalleries()).map((g) => g.galleryPath)
    }))
  )
}
