import {
  QueryClient,
  UseMutateFunction,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import bi from '../../../backend_interface'
import { IDiffObj, IVideoFull, IVideoWithRelated } from '../../../types'

const QUERIES = {
  fetchAvailableVideos: async (): Promise<string[]> =>
    fetch(`${bi.SERVER_URL}/${bi.GET_AVAILABLE_VIDEOS}`).then((res) => res.json()),

  fetchAllVideos: async (): Promise<IVideoFull[]> =>
    fetch(`${bi.SERVER_URL}/${bi.GET_ALL_VIDEOS}`).then((res) => res.json()),

  fetchVideo: async (videoPath: string): Promise<IVideoWithRelated> =>
    fetch(`${bi.SERVER_URL}/${bi.GET_VIDEO}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoPath: videoPath })
    }).then((res) => res.json()),

  createVideos: async (videoPaths: string[]): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.ADD_VIDEOS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoPaths: videoPaths })
    }),

  generateTgp: async (videoPath: string): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.GENERATE_TGP}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoPath: videoPath })
    }),

  generateMissingTgps: async (): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.GENERATE_MISSING_TGPS}`),

  deleteVideo: async (videoPathToRemove: string): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.DELETE_VIDEO}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoPath: videoPathToRemove })
    }),

  deleteMissingVideos: async (): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.DELETE_MISSING_VIDEOS}`),

  updateVideoGalleries: async ([videoPath, galleriesDiffObj]: [
    string,
    IDiffObj
  ]): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.UPDATE_VIDEO_GALLERIES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoPath: videoPath, diffObj: galleriesDiffObj })
    }),

  updateVideoTags: async ([videoPath, tagsDiffObj]: [string, IDiffObj]): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.UPDATE_VIDEO_TAGS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoPath: videoPath, diffObj: tagsDiffObj })
    })
}

const INVALIDATE_CACHES = {
  createVideos: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['availableVideos']),
      queryClient.invalidateQueries(['allVideos']),
      queryClient.invalidateQueries(['allGalleries'])
    ]),

  generateTgp: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['availableVideos']),
      queryClient.invalidateQueries(['allVideos'])
    ]),

  generateMissingTgps: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['availableVideos']),
      queryClient.invalidateQueries(['allVideos'])
    ]),

  deleteVideo: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['availableVideos']),
      queryClient.invalidateQueries(['allVideos']),
      queryClient.invalidateQueries(['allGalleries']),
      queryClient.invalidateQueries(['allTags'])
    ]),

  deleteMissingVideos: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['allVideos']),
      queryClient.invalidateQueries(['allGalleries']),
      queryClient.invalidateQueries(['allTags'])
    ]),

  updateVideoGalleries: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['allVideos']),
      queryClient.invalidateQueries(['allGalleries'])
    ]),

  updateVideoTags: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['allVideos']),
      queryClient.invalidateQueries(['allTags'])
    ])
}

export function useAvailableVideos(): UseQueryResult<string[], unknown> {
  return useQuery('availableVideos', QUERIES.fetchAvailableVideos, {
    staleTime: Infinity
  })
}

export function useAllVideos(): UseQueryResult<IVideoFull[], unknown> {
  return useQuery('allVideos', QUERIES.fetchAllVideos, {
    staleTime: Infinity
  })
}

export function useVideo(videoPath: string): UseQueryResult<IVideoWithRelated, unknown> {
  return useQuery(['allVideos', videoPath], () => QUERIES.fetchVideo(videoPath), {
    staleTime: Infinity
  })
}

export function useCreateVideos(): [
  UseMutateFunction<unknown, unknown, string[], unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(QUERIES.createVideos, {
    onSuccess: () => INVALIDATE_CACHES.createVideos(queryClient)
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useGenerateTgp(): [UseMutateFunction<unknown, unknown, string, unknown>, boolean] {
  const queryClient = useQueryClient()
  const mutation = useMutation(QUERIES.generateTgp, {
    onSuccess: () => INVALIDATE_CACHES.generateTgp(queryClient)
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useGenerateMissingTgps(): [
  UseMutateFunction<unknown, unknown, void, unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(QUERIES.generateMissingTgps, {
    onSuccess: () => INVALIDATE_CACHES.generateMissingTgps(queryClient)
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteVideo(): UseMutateFunction<unknown, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation(QUERIES.deleteVideo, {
    onSuccess: () => INVALIDATE_CACHES.deleteVideo(queryClient)
  }).mutate
}

export function useDeleteMissingVideos(): [
  UseMutateFunction<unknown, unknown, void, unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(QUERIES.deleteMissingVideos, {
    onSuccess: () => INVALIDATE_CACHES.deleteMissingVideos(queryClient)
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useUpdateVideoGalleries(): UseMutateFunction<
  unknown,
  unknown,
  [string, IDiffObj],
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(QUERIES.updateVideoGalleries, {
    onSuccess: () => INVALIDATE_CACHES.updateVideoGalleries(queryClient)
  }).mutate
}

export function useUpdateVideoTags(): UseMutateFunction<
  unknown,
  unknown,
  [string, IDiffObj],
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(QUERIES.updateVideoTags, {
    onSuccess: () => INVALIDATE_CACHES.updateVideoTags(queryClient)
  }).mutate
}
