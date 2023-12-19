import { useQuery } from 'react-query'
import mainAdapter from '../../../mainAdapter'

export function useAvailableGalleries() {
  return useQuery('availableGalleries', () => mainAdapter.getAvailableGalleries())
}

export function useAllGalleries() {
  return useQuery('allGalleries', () => mainAdapter.getAllGalleries())
}

export function useGallery(galleryPath) {
  return useQuery(['allGalleries', galleryPath], () => mainAdapter.getGallery(galleryPath))
}
