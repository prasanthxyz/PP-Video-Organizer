import * as db from './backend/db'
import * as gallery from './backend/gallery'
import * as rps from './backend/rps'
import * as tag from './backend/tag'
import * as utils from './backend/utils'
import * as video from './backend/video'

const ipcMethods = {
  generateTgp: video.generateTgp,
  isTgpExisting: video.isTgpExisting,
  generateMissingTgps: video.generateMissingTgps,
  deleteDbVideo: db.deleteVideo,
  createDbTags: db.createTags,
  getDbTags: db.getTags,
  deleteDbTag: db.deleteTag,
  createDbGallery: db.createGallery,
  deleteDbGallery: db.deleteGallery,
  isDirExisting: gallery.isDirExisting,
  updateDbVideoTags: db.updateVideoTags,
  updateDbVideoGalleries: db.updateVideoGalleries,
  getCombinationsData: rps.getCombinationsData,
  deleteMissingDbVideos: video.deleteMissingVideos,
  deleteMissingDbGalleries: gallery.deleteMissingGalleries,
  getDbGalleryData: db.getGalleryData,
  updateDbGalleryVideos: db.updateGalleryVideos,
  getDbTagData: db.getTagData,
  updateDbTagVideos: db.updateTagVideos,
  isCommandExisting: utils.isCommandExisting,
  execCommand: utils.execCommand,
  addVideos: video.addVideos,
  getAvailableVideos: video.getAvailableVideos,
  getAvailableTags: tag.getAvailableTags,
  getAvailableGalleries: gallery.getAvailableGalleries,
  getAllGalleries: gallery.getAllGalleries,
  getAllTags: tag.getAllTags,
  getAllVideos: video.getAllVideos,
  getGallery: gallery.getGallery,
  getVideo: video.getVideo
}

export default ipcMethods
