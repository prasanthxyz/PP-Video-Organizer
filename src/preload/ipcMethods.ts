import * as db from '../main/backend/db'
import * as gallery from '../main/backend/gallery'
import * as rps from '../main/backend/rps'
import * as tag from '../main/backend/tag'
import * as utils from '../main/backend/utils'
import * as video from '../main/backend/video'

// import {
//   IDiffObj,
//   IGallery,
//   IGalleryFull,
//   ITag,
//   ITagFull,
//   IVideoFull,
//   IVideoWithRelated,
// } from './renderer/types';
// export interface IIpcMethods {
//   getExecutablesStatus: () => Promise<boolean[]>;
//   : (cmd: string) => boolean;
//   getAvailableGalleries: () => Promise<string[]>;
//   getAllGalleries: () => Promise<IGallery[]>;
//   getGallery: (galleryPath: string) => Promise<IGalleryFull>;
//   deleteMissingDbGalleries: () => Promise<void>;
//   createDbGallery: (galleryPath: string) => Promise<void>;
//   deleteDbGallery: (galleryPath: string) => Promise<void>;
//   updateDbGalleryVideos: (
//     galleryPath: string,
//     diffObj: IDiffObj,
//   ) => Promise<void>;
//   createDbTags: (tagTitles: string) => Promise<void>;
//   deleteDbTag: (tagTitle: string) => Promise<void>;
//   updateDbVideoTags: (videoPath: string, diffObj: IDiffObj) => Promise<void>;
//   updateDbTagVideos: (tagTitle: string, diffObj: IDiffObj) => Promise<void>;
//   deleteDbVideo: (videoPath: string) => Promise<void>;
//   updateDbVideoGalleries: (
//     videoPath: string,
//     diffObj: IDiffObj,
//   ) => Promise<void>;
//   getAvailableTags: () => Promise<string[]>;
//   getAllTags: () => Promise<ITag[]>;
//   getTag: (tagTitle: string) => Promise<ITagFull>;
//   generateTgp: (videoPath: string, regenerate?: boolean) => Promise<void>;
//   generateMissingTgps: () => Promise<void>;
//   deleteMissingDbVideos: () => Promise<void>;
//   addVideos: (videoPaths: string[]) => Promise<void>;
//   getAvailableVideos: () => Promise<string[]>;
//   getAllVideos: () => Promise<IVideoFull[]>;
//   getVideo: (videoPath: string) => Promise<IVideoWithRelated>;
//   getCombinationsData: (
//     vps: Set<string>,
//     ts: Set<string>,
//     gs: Set<string>,
//   ) => Promise<[string, string][]>;
// }

// eslint-disable-next-line @typescript-eslint/ban-types
export const ipcMethods: { [fn: string]: Function } = {
  getExecutablesStatus: utils.getExecutablesStatus,
  getAvailableGalleries: gallery.getAvailableGalleries,
  getAllGalleries: gallery.getAllGalleries,
  getGallery: gallery.getGallery,
  deleteMissingDbGalleries: gallery.deleteMissingGalleries,
  createDbGallery: db.createGallery,
  deleteDbGallery: db.deleteGallery,
  updateDbGalleryVideos: db.updateGalleryVideos,
  createDbTags: db.createTags,
  deleteDbTag: db.deleteTag,
  updateDbVideoTags: db.updateVideoTags,
  updateDbTagVideos: db.updateTagVideos,
  deleteDbVideo: db.deleteVideo,
  updateDbVideoGalleries: db.updateVideoGalleries,
  getAvailableTags: tag.getAvailableTags,
  getAllTags: tag.getAllTags,
  getTag: tag.getTag,
  generateTgp: video.generateTgp,
  generateMissingTgps: video.generateMissingTgps,
  deleteMissingDbVideos: video.deleteMissingVideos,
  addVideos: video.addVideos,
  getAvailableVideos: video.getAvailableVideos,
  getAllVideos: video.getAllVideos,
  getVideo: video.getVideo,
  getCombinationsData: rps.getCombinationsData
}
