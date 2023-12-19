import { useMutation, useQuery, useQueryClient } from 'react-query'
import mainAdapter from '../../../mainAdapter'

export function useAvailableVideos() {
  return useQuery('availableVideos', () => mainAdapter.getAvailableVideos())
}

export function useAllVideos() {
  return useQuery('allVideos', () => mainAdapter.getAllVideos())
}

export function useVideo(videoPath) {
  return useQuery(['allVideos', videoPath], () => mainAdapter.getVideo(videoPath))
}

export function useCreateVideos() {
  const queryClient = useQueryClient()
  const mutation = useMutation((videoPaths) => mainAdapter.addVideos(videoPaths), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableVideos'])
      queryClient.invalidateQueries(['allVideos'])
    }
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useGenerateTgp() {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (videoPath) => mainAdapter.generateTgp(videoPath).then(() => videoPath),
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

export function useGenerateMissingTgps() {
  const queryClient = useQueryClient()
  const mutation = useMutation(() => mainAdapter.generateMissingTgps(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableVideos'])
      queryClient.invalidateQueries(['allVideos'])
    }
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteVideo() {
  const queryClient = useQueryClient()
  return useMutation(
    (videoPathToRemove) =>
      mainAdapter.deleteDbVideo(videoPathToRemove).then(() => videoPathToRemove),
    {
      onSuccess: (videoPathToRemove) => {
        queryClient.invalidateQueries(['availableVideos'])
        queryClient.invalidateQueries(['allVideos'])
        queryClient.invalidateQueries(['allVideos', videoPathToRemove])
      }
    }
  ).mutate
}

export function useDeleteMissingVideos() {
  const queryClient = useQueryClient()
  const mutation = useMutation(() => mainAdapter.deleteMissingDbVideos(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableVideos'])
      queryClient.invalidateQueries(['allVideos'])
    }
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useUpdateVideoRelations() {
  const queryClient = useQueryClient()
  return useMutation(
    ([videoPath, tagsDiffObj, galleriesDiffObj]) => {
      return Promise.all([
        mainAdapter.updateDbVideoTags(videoPath, tagsDiffObj),
        mainAdapter.updateDbVideoGalleries(videoPath, galleriesDiffObj)
      ]).then(() => videoPath)
    },
    {
      onSuccess: (videoPath) => {
        queryClient.invalidateQueries(['availableVideos'])
        queryClient.invalidateQueries(['allVideos'])
        queryClient.invalidateQueries(['allVideos', videoPath])
      }
    }
  ).mutate
}
