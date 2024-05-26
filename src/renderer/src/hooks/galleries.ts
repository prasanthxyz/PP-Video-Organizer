import {
  UseMutateFunction,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import bi from '../../../backend_interface'
import { IDiffObj, IGallery, IGalleryFull } from '../../../types'

export function useAvailableGalleries(): UseQueryResult<string[], unknown> {
  return useQuery(
    'availableGalleries',
    () => fetch(`${bi.SERVER_URL}/${bi.GET_AVAILABLE_GALLERIES}`).then((res) => res.json()),
    {
      staleTime: Infinity
    }
  )
}

export function useAllGalleries(): UseQueryResult<IGallery[], unknown> {
  return useQuery(
    'allGalleries',
    () => fetch(`${bi.SERVER_URL}/${bi.GET_ALL_GALLERIES}`).then((res) => res.json()),
    {
      staleTime: Infinity
    }
  )
}

export function useGallery(galleryPath: string): UseQueryResult<IGalleryFull, unknown> {
  return useQuery(
    ['allGalleries', galleryPath],
    () =>
      fetch(`${bi.SERVER_URL}/${bi.GET_GALLERY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryPath: galleryPath })
      }).then((res) => res.json()),
    {
      staleTime: Infinity
    }
  )
}

export function useCreateGallery(): [
  UseMutateFunction<unknown, unknown, string, unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (galleryInput: string) =>
      fetch(`${bi.SERVER_URL}/${bi.CREATE_GALLERY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryPath: galleryInput })
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['availableGalleries'])
        queryClient.invalidateQueries(['allGalleries'])
      }
    }
  )
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteGallery(): UseMutateFunction<unknown, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation(
    (galleryPathToRemove: string) =>
      fetch(`${bi.SERVER_URL}/${bi.DELETE_GALLERY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryPath: galleryPathToRemove })
      }).then(() => galleryPathToRemove),
    {
      onSuccess: (galleryPathToRemove) => {
        queryClient.invalidateQueries(['availableGalleries'])
        queryClient.invalidateQueries(['allGalleries'])
        queryClient.invalidateQueries(['allGalleries', galleryPathToRemove])
      }
    }
  ).mutate
}

export function useDeleteMissingGalleries(): [
  UseMutateFunction<unknown, unknown, void, unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(() => fetch(`${bi.SERVER_URL}/${bi.DELETE_MISSING_GALLERIES}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableGalleries'])
      queryClient.invalidateQueries(['allGalleries'])
    }
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useUpdateGalleryVideos(): UseMutateFunction<
  unknown,
  unknown,
  [string, IDiffObj],
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(
    ([galleryPath, videosDiffObj]: [string, IDiffObj]) =>
      fetch(`${bi.SERVER_URL}/${bi.UPDATE_GALLERY_VIDEOS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryPath: galleryPath, diffObj: videosDiffObj })
      }).then(() => galleryPath),
    {
      onSuccess: (galleryPath) => {
        queryClient.invalidateQueries(['availableGalleries'])
        queryClient.invalidateQueries(['allGalleries'])
        queryClient.invalidateQueries(['allGalleries', galleryPath])
      }
    }
  ).mutate
}
