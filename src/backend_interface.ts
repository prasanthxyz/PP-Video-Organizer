const backendInterface = {
  SERVER_URL: 'http://localhost:3000',

  // UTILS
  GET_EXECUTABLES_STATUS: 'get-executables-status',

  // RELATIONS
  UPDATE_VIDEO_GALLERIES: 'update-video-galleries',
  UPDATE_VIDEO_TAGS: 'update-video-tags',
  UPDATE_GALLERY_VIDEOS: 'update-gallery-videos',
  UPDATE_TAG_VIDEOS: 'update-tag-videos',

  // VIDEO
  GET_ALL_VIDEOS: 'get-all-videos',
  GET_VIDEO: 'get-video',
  ADD_VIDEOS: 'add-videos',
  DELETE_VIDEO: 'delete-video',
  DELETE_MISSING_VIDEOS: 'delete-missing-videos',
  GENERATE_TGP: 'generate-tgp',
  GENERATE_MISSING_TGPS: 'generate-missing-tgps',

  // GALLERY
  GET_ALL_GALLERIES: 'get-all-galleries',
  GET_GALLERY: 'get-gallery',
  CREATE_GALLERY: 'create-gallery',
  DELETE_GALLERY: 'delete-gallery',
  DELETE_MISSING_GALLERIES: 'delete-missing-galleries',

  // TAG
  GET_ALL_TAGS: 'get-all-tags',
  GET_TAG: 'get-tag',
  CREATE_TAGS: 'create-tags',
  DELETE_TAG: 'delete-tag'
}

export default backendInterface
