import {
  UseMutateFunction,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import bi from '../../../backend_interface'
import { IDiffObj, IVideoFull, IVideoWithRelated } from '../../../types'

export function useAvailableVideos(): UseQueryResult<string[], unknown> {
  return useQuery(
    'availableVideos',
    () => fetch(`${bi.SERVER_URL}/${bi.GET_AVAILABLE_VIDEOS}`).then((res) => res.json()),
    {
      staleTime: Infinity
    }
  )
}

export function useAllVideos(): UseQueryResult<IVideoFull[], unknown> {
  return useQuery(
    'allVideos',
    () => fetch(`${bi.SERVER_URL}/${bi.GET_ALL_VIDEOS}`).then((res) => res.json()),
    {
      staleTime: Infinity
    }
  )
}

export function useVideo(videoPath: string): UseQueryResult<IVideoWithRelated, unknown> {
  return useQuery(
    ['allVideos', videoPath],
    () =>
      fetch(`${bi.SERVER_URL}/${bi.GET_VIDEO}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoPath: videoPath })
      }).then((res) => res.json()),
    {
      staleTime: Infinity
    }
  )
}

export function useCreateVideos(): [
  UseMutateFunction<unknown, unknown, string[], unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (videoPaths: string[]) =>
      fetch(`${bi.SERVER_URL}/${bi.ADD_VIDEOS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoPaths: videoPaths })
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['availableVideos'])
        queryClient.invalidateQueries(['allVideos'])
        queryClient.invalidateQueries(['availableGalleries'])
        queryClient.invalidateQueries(['allGalleries'])
      }
    }
  )
  return [mutation.mutate, mutation.isLoading]
}

export function useGenerateTgp(): [UseMutateFunction<unknown, unknown, string, unknown>, boolean] {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (videoPath: string) =>
      fetch(`${bi.SERVER_URL}/${bi.GENERATE_TGP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoPath: videoPath })
      }).then(() => videoPath),
    {
      onSuccess: (videoPath) => {
        queryClient.invalidateQueries(['availableVideos'])
        queryClient.invalidateQueries(['allVideos'])
        queryClient.invalidateQueries(['allVideos', videoPath])
      }
    }
  )
  return [mutation.mutate, mutation.isLoading]
}

export function useGenerateMissingTgps(): [
  UseMutateFunction<unknown, unknown, void, unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(() => fetch(`${bi.SERVER_URL}/${bi.GENERATE_MISSING_TGPS}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableVideos'])
      queryClient.invalidateQueries(['allVideos'])
    }
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteVideo(): UseMutateFunction<unknown, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation(
    (videoPathToRemove: string) =>
      fetch(`${bi.SERVER_URL}/${bi.DELETE_VIDEO}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoPath: videoPathToRemove })
      }).then(() => videoPathToRemove),
    {
      onSuccess: (videoPathToRemove) => {
        queryClient.invalidateQueries(['availableVideos'])
        queryClient.invalidateQueries(['allVideos'])
        queryClient.invalidateQueries(['allVideos', videoPathToRemove])
      }
    }
  ).mutate
}

export function useDeleteMissingVideos(): [
  UseMutateFunction<unknown, unknown, void, unknown>,
  boolean
] {
  const queryClient = useQueryClient()
  const mutation = useMutation(() => fetch(`${bi.SERVER_URL}/${bi.DELETE_MISSING_VIDEOS}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableVideos'])
      queryClient.invalidateQueries(['allVideos'])
    }
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
  return useMutation(
    ([videoPath, galleriesDiffObj]: [string, IDiffObj]) =>
      fetch(`${bi.SERVER_URL}/${bi.UPDATE_VIDEO_GALLERIES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoPath: videoPath, diffObj: galleriesDiffObj })
      }).then(() => videoPath),
    {
      onSuccess: (videoPath) => {
        queryClient.invalidateQueries(['availableVideos'])
        queryClient.invalidateQueries(['allVideos'])
        queryClient.invalidateQueries(['allVideos', videoPath])
      }
    }
  ).mutate
}

export function useUpdateVideoTags(): UseMutateFunction<
  unknown,
  unknown,
  [string, IDiffObj],
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(
    ([videoPath, tagsDiffObj]: [string, IDiffObj]) =>
      fetch(`${bi.SERVER_URL}/${bi.UPDATE_VIDEO_TAGS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoPath: videoPath, diffObj: tagsDiffObj })
      }).then(() => videoPath),
    {
      onSuccess: (videoPath) => {
        queryClient.invalidateQueries(['availableVideos'])
        queryClient.invalidateQueries(['allVideos'])
        queryClient.invalidateQueries(['allVideos', videoPath])
      }
    }
  ).mutate
}
