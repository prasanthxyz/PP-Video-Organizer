import * as db from './backend/db'
import * as gallery from './backend/gallery'
import * as video from './backend/video'

const ipcMethods = {
  getDbVideos: db.getVideos,
  createDbVideos: db.createVideos,
  generateTgp: video.generateTgp,
  isTgpExisting: video.isTgpExisting,
  generateMissingTgps: video.generateMissingTgps,
  isFileExisting: video.isFileExisting,
  deleteDbVideo: db.deleteVideo,
  createDbTags: db.createTags,
  getDbTags: db.getTags,
  deleteDbTag: db.deleteTag,
  getDbGalleries: db.getGalleries,
  createDbGallery: db.createGallery,
  deleteDbGallery: db.deleteGallery,
  isDirExisting: gallery.isDirExisting,
  getGalleryImagePaths: gallery.getGalleryImagePaths,
  getDbVideoData: db.getVideoData,
  updateDbVideoTags: db.updateVideoTags,
  updateDbVideoGalleries: db.updateVideoGalleries,
  getCombinationsData: db.getCombinationsData,
  deleteMissingDbVideos: video.deleteMissingVideos,
  deleteMissingDbGalleries: gallery.deleteMissingGalleries
}

export default ipcMethods
