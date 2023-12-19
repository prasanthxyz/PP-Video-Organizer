import { Op } from 'sequelize'
import { Gallery, Tag, Video } from '../main/database/database'

export async function deleteVideo(videoPath) {
  await Video.destroy({ where: { filePath: videoPath } })
}

export async function deleteVideos(videoPaths) {
  await Video.destroy({ where: { filePath: { [Op.in]: videoPaths } } })
}

export async function deleteTag(tagTitle) {
  await Tag.destroy({ where: { title: tagTitle } })
}

export async function deleteGallery(galleryPath) {
  await Gallery.destroy({ where: { galleryPath: galleryPath } })
}

export async function deleteGalleries(galleryPaths) {
  await Gallery.destroy({ where: { galleryPath: { [Op.in]: galleryPaths } } })
}

export async function getVideos() {
  return await Video.findAll({ raw: true })
}

export async function getTags() {
  return await Tag.findAll({ raw: true })
}

export async function getGalleries() {
  return await Gallery.findAll({ raw: true })
}

export async function createVideos(videos) {
  await Video.bulkCreate(videos)
}

export async function createTags(tagTitles) {
  const existingTags = new Set((await getTags()).map((t) => t.title))
  const validTags = tagTitles
    .toLowerCase()
    .split(' ')
    .map((tagTitle) => tagTitle.trim())
    .filter((tagTitle) => tagTitle !== '' && !existingTags.has(tagTitle))
    .map((tagTitle) => ({ title: tagTitle }))
  Tag.bulkCreate(validTags)
}

export async function createGallery(galleryPath) {
  const existingGalleries = new Set((await getGalleries()).map((v) => v.galleryPath))
  if (existingGalleries.has(galleryPath)) return
  await Gallery.create({ galleryPath: galleryPath })
}

export async function getVideoData(videoPath) {
  const videoObj = await Video.findOne({
    where: { filePath: videoPath },
    include: [Tag, Gallery]
  })
  return {
    tags: await videoObj.getTags({ raw: true }),
    galleries: await videoObj.getGalleries({ raw: true })
  }
}

export async function getGalleryData(galleryPath) {
  const galleryObj = await Gallery.findOne({
    where: { galleryPath: galleryPath },
    include: [Video]
  })
  return {
    videos: await galleryObj.getVideos({ raw: true })
  }
}

export async function getTagData(tagTitle) {
  const tagObj = await Tag.findOne({
    where: { title: tagTitle },
    include: [Video]
  })
  return {
    videos: await tagObj.getVideos({ raw: true })
  }
}

export async function updateVideoTags(videoPath, diffObj) {
  const videoObj = await Video.findOne({ where: { filePath: videoPath } })
  await videoObj.addTags(diffObj['add'])
  await videoObj.removeTags(diffObj['remove'])
}

export async function updateVideoGalleries(videoPath, diffObj) {
  const videoObj = await Video.findOne({ where: { filePath: videoPath } })
  await videoObj.addGalleries(diffObj['add'])
  await videoObj.removeGalleries(diffObj['remove'])
}

export async function updateGalleryVideos(galleryPath, diffObj) {
  const galleryObj = await Gallery.findOne({ where: { galleryPath: galleryPath } })
  await galleryObj.addVideos(diffObj['add'])
  await galleryObj.removeVideos(diffObj['remove'])
}

export async function updateTagVideos(tagTitle, diffObj) {
  const tagObj = await Tag.findOne({ where: { title: tagTitle } })
  await tagObj.addVideos(diffObj['add'])
  await tagObj.removeVideos(diffObj['remove'])
}

export async function getSelectedVideos(videoPaths) {
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
