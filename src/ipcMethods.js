import * as db from './backend/db'
import * as gallery from './backend/gallery'
import * as rps from './backend/rps'
import * as tag from './backend/tag'
import * as utils from './backend/utils'
import * as video from './backend/video'

const ipcMethods = {
  getPythonExecutable: utils.getPythonExecutable,
  generateTgp: video.generateTgp,
  generateMissingTgps: video.generateMissingTgps,
  deleteDbVideo: db.deleteVideo,
  createDbTags: db.createTags,
  deleteDbTag: db.deleteTag,
  createDbGallery: db.createGallery,
  deleteDbGallery: db.deleteGallery,
  updateDbVideoTags: db.updateVideoTags,
  updateDbVideoGalleries: db.updateVideoGalleries,
  getCombinationsData: rps.getCombinationsData,
  deleteMissingDbVideos: video.deleteMissingVideos,
  deleteMissingDbGalleries: gallery.deleteMissingGalleries,
  updateDbGalleryVideos: db.updateGalleryVideos,
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
  getVideo: video.getVideo,
  getTag: tag.getTag
}

export default ipcMethods
