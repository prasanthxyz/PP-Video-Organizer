import { Context } from 'koa'
import { IGallery } from '../../../types'
import * as galleryUtils from '../utils/gallery'

export function getAllGalleries(ctx: Context): void {
  const allGalleries: IGallery[] = galleryUtils.getAllGalleries()
  ctx.body = allGalleries
}

export function getGallery(ctx: Context): void {
  const requestData = ctx.request.body as { galleryPath: string }
  const galleryData: IGallery = galleryUtils.getGalleryData(requestData.galleryPath)
  ctx.body = galleryData
}

export function createGallery(ctx: Context): void {
  const requestData = ctx.request.body as { galleryPath: string }
  galleryUtils.createGallery(requestData.galleryPath)
  ctx.body = { success: true }
}

export function deleteGallery(ctx: Context): void {
  const requestData = ctx.request.body as { galleryPath: string }
  galleryUtils.deleteGallery(requestData.galleryPath)
  ctx.body = { success: true }
}

export function deleteMissingGalleries(ctx: Context): void {
  galleryUtils.deleteMissingGalleries()
  ctx.body = { success: true }
}
