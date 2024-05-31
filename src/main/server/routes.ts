import Router from 'koa-router'
import * as galleryControllers from './controllers/gallery.controllers'
import * as relationsControllers from './controllers/relations.controllers'
import * as tagControllers from './controllers/tag.controllers'
import * as utilsControllers from './controllers/utils.controllers'
import * as videoControllers from './controllers/video.controllers'

const router = new Router()

// UTILS
router.get('/get-executables-status', utilsControllers.getExecutablesStatus)

// RELATIONS
router.post('/update-video-galleries', relationsControllers.updateVideoGalleries)
router.post('/update-video-tags', relationsControllers.updateVideoTags)
router.post('/update-gallery-videos', relationsControllers.updateGalleryVideos)
router.post('/update-tag-videos', relationsControllers.updateTagVideos)

// VIDEO
router.get('/get-all-videos', videoControllers.getAllVideos)
router.post('/get-video', videoControllers.getVideo)
router.post('/add-videos', videoControllers.addVideos)
router.post('/delete-video', videoControllers.deleteVideo)
router.get('/delete-missing-videos', videoControllers.deleteMissingVideos)
router.post('/generate-tgp', videoControllers.generateTgp)
router.get('/generate-missing-tgps', videoControllers.generateMissingTgps)

// GALLERY
router.get('/get-all-galleries', galleryControllers.getAllGalleries)
router.post('/get-gallery', galleryControllers.getGallery)
router.post('/create-gallery', galleryControllers.createGallery)
router.post('/delete-gallery', galleryControllers.deleteGallery)
router.get('/delete-missing-galleries', galleryControllers.deleteMissingGalleries)

// TAG
router.get('/get-all-tags', tagControllers.getAllTags)
router.post('/get-tag', tagControllers.getTag)
router.post('/create-tags', tagControllers.createTags)
router.post('/delete-tag', tagControllers.deleteTag)

export default router
