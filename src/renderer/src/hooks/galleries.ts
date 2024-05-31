import {
  QueryClient,
  UseMutateFunction,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import bi from '../../../backend_interface'
import { IDiffObj, IGallery } from '../../../types'

const QUERIES = {
  fetchAllGalleries: async (): Promise<IGallery[]> =>
    fetch(`${bi.SERVER_URL}/${bi.GET_ALL_GALLERIES}`).then((res) => res.json()),

  fetchGallery: async (galleryPath: string): Promise<IGallery> =>
    fetch(`${bi.SERVER_URL}/${bi.GET_GALLERY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryPath: galleryPath })
    }).then((res) => res.json()),

  createGallery: async (galleryInput: string): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.CREATE_GALLERY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryPath: galleryInput })
    }),

  deleteGallery: async (galleryPathToRemove: string): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.DELETE_GALLERY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryPath: galleryPathToRemove })
    }),

  deleteMissingGalleries: async (): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.DELETE_MISSING_GALLERIES}`),

  updateGalleryVideos: async ([galleryPath, videosDiffObj]: [
    string,
    IDiffObj
  ]): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.UPDATE_GALLERY_VIDEOS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryPath: galleryPath, diffObj: videosDiffObj })
    })
}

const INVALIDATE_CACHES = {
  createGallery: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['allGalleries']),
      queryClient.invalidateQueries(['allVideos'])
    ]),

  deleteGallery: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['allGalleries']),
      queryClient.invalidateQueries(['allVideos'])
    ]),

  deleteMissingGalleries: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['allGalleries']),
      queryClient.invalidateQueries(['allVideos'])
    ]),

  updateGalleryVideos: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['allGalleries']),
      queryClient.invalidateQueries(['allVideos'])
    ])
}

export function useAllGalleries(): UseQueryResult<IGallery[], unknown> {
  return useQuery('allGalleries', QUERIES.fetchAllGalleries, {
    staleTime: Infinity
  })
}

export function useGallery(galleryPath: string): UseQueryResult<IGallery, unknown> {
  return useQuery(['allGalleries', galleryPath], () => QUERIES.fetchGallery(galleryPath), {
    staleTime: Infinity
  })
}

export function useCreateGallery(): [
  UseMutateFunction<unknown, unknown, string, unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(QUERIES.createGallery, {
    onSuccess: () => INVALIDATE_CACHES.createGallery(queryClient)
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteGallery(): UseMutateFunction<unknown, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation(QUERIES.deleteGallery, {
    onSuccess: () => INVALIDATE_CACHES.deleteGallery(queryClient)
  }).mutate
}

export function useDeleteMissingGalleries(): [
  UseMutateFunction<unknown, unknown, void, unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(QUERIES.deleteMissingGalleries, {
    onSuccess: () => INVALIDATE_CACHES.deleteMissingGalleries(queryClient)
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
  return useMutation(QUERIES.updateGalleryVideos, {
    onSuccess: () => INVALIDATE_CACHES.updateGalleryVideos(queryClient)
  }).mutate
}
