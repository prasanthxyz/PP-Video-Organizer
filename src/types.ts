export interface IVideoModel {
  filePath: string
  width: number
  height: number
  frameRate: number
  bitRate: number
  duration: number
  quality: number
}

export interface IVideoData {
  id: string
  isAvailable: boolean
  imgDir: string
  tgpPath: string
  isTgpAvailable: boolean
  videoName: string
  tags: string[]
  galleries: string[]
}

export interface IVideo extends IVideoModel, IVideoData {}

export interface IGallery {
  id: string
  galleryPath: string
  isAvailable: boolean
  galleryName: string
  images: string[]
  videos: string[]
}

export interface ITag {
  id: string
  title: string
  videos: string[]
}

export interface IDiffObj {
  add: string[]
  remove: string[]
}

export interface IPage {
  text: string
  shortcut: string
  location: string
  prefix: string
}
