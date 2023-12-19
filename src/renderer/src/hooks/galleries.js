import { useMutation, useQuery, useQueryClient } from 'react-query'
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

export function useCreateGallery() {
  const queryClient = useQueryClient()
  const mutation = useMutation((galleryInput) => mainAdapter.createDbGallery(galleryInput), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableGalleries'])
      queryClient.invalidateQueries(['allGalleries'])
    }
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteGallery() {
  const queryClient = useQueryClient()
  return useMutation(
    (galleryPathToRemove) =>
      mainAdapter.deleteDbGallery(galleryPathToRemove).then(() => galleryPathToRemove),
    {
      onSuccess: (galleryPathToRemove) => {
        queryClient.invalidateQueries(['availableGalleries'])
        queryClient.invalidateQueries(['allGalleries'])
        queryClient.invalidateQueries(['allGalleries', galleryPathToRemove])
      }
    }
  ).mutate
}

export function useDeleteMissingGalleries() {
  const queryClient = useQueryClient()
  const mutation = useMutation(() => mainAdapter.deleteMissingDbGalleries(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableGalleries'])
      queryClient.invalidateQueries(['allGalleries'])
    }
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useUpdateGalleryVideos() {
  const queryClient = useQueryClient()
  return useMutation(
    ([galleryPath, videosDiffObj]) =>
      mainAdapter.updateDbGalleryVideos(galleryPath, videosDiffObj).then(() => galleryPath),
    {
      onSuccess: (galleryPath) => {
        queryClient.invalidateQueries(['availableGalleries'])
        queryClient.invalidateQueries(['allGalleries'])
        queryClient.invalidateQueries(['allGalleries', galleryPath])
      }
    }
  ).mutate
}
