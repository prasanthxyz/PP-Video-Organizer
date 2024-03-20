export interface IGalleryModel {
  galleryPath: string
}

export interface ITagModel {
  title: string
}

export interface IVideoModel {
  filePath: string
  width: number
  height: number
  frameRate: number
  bitRate: number
  duration: number
  quality: number
}

export interface IDiffObj {
  add: string[]
  remove: string[]
}

export interface IGallery {
  id: string
  galleryPath: string
  galleryName: string
  isAvailable: boolean
}

export interface IGalleryFull {
  id: string
  galleryPath: string
  galleryName: string
  isAvailable: boolean
  images: string[]
  videos: IVideoModel[]
}

export interface ITag {
  id: string
  title: string
}

export interface ITagFull {
  id: string
  title: string
  videos: IVideoModel[]
}

export interface IVideo {
  id: string
  isAvailable: boolean
  tgpPath: string
  isTgpAvailable: boolean
  videoName: string
  imgDir: string
}

export interface IVideoFull {
  filePath: string
  width: number
  height: number
  frameRate: number
  bitRate: number
  duration: number
  quality: number

  id: string
  isAvailable: boolean
  tgpPath: string
  isTgpAvailable: boolean
  videoName: string
  imgDir: string
}

export interface IVideoWithRelated {
  id: string
  isAvailable: boolean
  tgpPath: string
  isTgpAvailable: boolean
  videoName: string
  imgDir: string
  tags: ITagModel[]
  galleries: IGalleryModel[]
}

export interface IPage {
  text: string
  shortcut: string
  location: string
  prefix: string
}
