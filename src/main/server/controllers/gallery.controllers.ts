import * as fs from 'fs'
import { Context } from 'koa'
import _ from 'lodash'
import * as path from 'path'
import { IGalleryModel } from '../../../types'
import * as dataUtils from '../utils/data'
import * as galleryUtils from '../utils/gallery'

export function getAvailableGalleries(ctx: Context): void {
  ctx.body = galleryUtils
    .getGalleries()
    .map((g: IGalleryModel) => g.galleryPath as string)
    .filter(fs.existsSync)
    .sort((a, b) => (a > b ? 1 : b > a ? -1 : 0))
}

export function getAllGalleries(ctx: Context): void {
  ctx.body = galleryUtils.getAllGalleries()
}

export function getGallery(ctx: Context): void {
  const requestData = ctx.request.body as { galleryPath: string }
  const galleryPath = requestData.galleryPath
  const galleryData = galleryUtils.getGalleryData(galleryPath)
  ctx.body = {
    ...galleryData,
    id: galleryPath,
    galleryPath,
    galleryName: path.basename(galleryPath),
    isAvailable: fs.existsSync(galleryPath),
    images: _.shuffle(
      galleryUtils.getGalleryImagePaths(galleryPath).map((i) => `file:///${i.replace(/\\/g, '/')}`)
    )
  }
}

export function createGallery(ctx: Context): void {
  const requestData = ctx.request.body as { galleryPath: string }
  const galleryPath = requestData.galleryPath
  const existingGalleries = new Set(
    galleryUtils.getGalleries().map((g: IGalleryModel) => g.galleryPath)
  )
  if (existingGalleries.has(galleryPath)) return
  dataUtils.data.galleries.push(galleryPath)
  dataUtils.storeData()
  ctx.body = { success: true }
}

export function deleteGallery(ctx: Context): void {
  const requestData = ctx.request.body as { galleryPath: string }
  const galleryPath = requestData.galleryPath
  dataUtils.data.galleries = dataUtils.data.galleries.filter((gp) => gp !== galleryPath)
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter(
    (vg) => vg[1] !== galleryPath
  )
  dataUtils.storeData()
  ctx.body = { success: true }
}

export function deleteMissingGalleries(ctx: Context): void {
  const allGalleries: string[] = galleryUtils
    .getGalleries()
    .map((g: IGalleryModel) => g.galleryPath) as string[]
  const missingGalleries = new Set(allGalleries.filter((g: string) => !fs.existsSync(g)))
  dataUtils.data.galleries = dataUtils.data.galleries.filter((gp) => !missingGalleries.has(gp))
  dataUtils.data.videoGalleries = dataUtils.data.videoGalleries.filter(
    (vg) => !missingGalleries.has(vg[1])
  )
  dataUtils.storeData()
  ctx.body = { success: true }
}
