import { useMutation, useQuery, useQueryClient } from 'react-query'
import mainAdapter from '../../../mainAdapter'

export function useAvailableTags() {
  return useQuery('availableTags', () => mainAdapter.getAvailableTags())
}

export function useAllTags() {
  return useQuery('allTags', () => mainAdapter.getAllTags())
}

export function useTag(tagTitle) {
  return useQuery(['allTags', tagTitle], () => mainAdapter.getTag(tagTitle))
}

export function useCreateTags() {
  const queryClient = useQueryClient()
  const mutation = useMutation((tagInput) => mainAdapter.createDbTags(tagInput), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableTags'])
      queryClient.invalidateQueries(['allTags'])
    }
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation(
    (tagTitleToRemove) => mainAdapter.deleteDbTag(tagTitleToRemove).then(() => tagTitleToRemove),
    {
      onSuccess: (tagTitleToRemove) => {
        queryClient.invalidateQueries(['availableTags'])
        queryClient.invalidateQueries(['allTags'])
        queryClient.invalidateQueries(['allTags', tagTitleToRemove])
      }
    }
  ).mutate
}

export function useUpdateTagVideos() {
  const queryClient = useQueryClient()
  return useMutation(
    ([tagTitle, videosDiffObj]) =>
      mainAdapter.updateDbTagVideos(tagTitle, videosDiffObj).then(() => tagTitle),
    {
      onSuccess: (tagTitle) => {
        queryClient.invalidateQueries(['availableTags'])
        queryClient.invalidateQueries(['allTags'])
        queryClient.invalidateQueries(['allTags', tagTitle])
      }
    }
  ).mutate
}
