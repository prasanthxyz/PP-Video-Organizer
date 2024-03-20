import {
  UseMutateFunction,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import { IDiffObj, ITag, ITagFull } from '../../../types'

export function useAvailableTags(): UseQueryResult<string[], unknown> {
  return useQuery('availableTags', () => window.api.getAvailableTags(), {
    staleTime: Infinity
  })
}

export function useAllTags(): UseQueryResult<ITag[], unknown> {
  return useQuery('allTags', () => window.api.getAllTags(), {
    staleTime: Infinity
  })
}

export function useTag(tagTitle: string): UseQueryResult<ITagFull, unknown> {
  return useQuery(['allTags', tagTitle], () => window.api.getTag(tagTitle), {
    staleTime: Infinity
  })
}

export function useCreateTags(): [UseMutateFunction<unknown, unknown, string, unknown>, boolean] {
  const queryClient = useQueryClient()
  const mutation = useMutation((tagInput: string) => window.api.createDbTags(tagInput), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableTags'])
      queryClient.invalidateQueries(['allTags'])
    }
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteTag(): UseMutateFunction<unknown, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation(
    (tagTitleToRemove: string) =>
      window.api.deleteDbTag(tagTitleToRemove).then(() => tagTitleToRemove),
    {
      onSuccess: (tagTitleToRemove) => {
        queryClient.invalidateQueries(['availableTags'])
        queryClient.invalidateQueries(['allTags'])
        queryClient.invalidateQueries(['allTags', tagTitleToRemove])
      }
    }
  ).mutate
}

export function useUpdateTagVideos(): UseMutateFunction<
  unknown,
  unknown,
  [string, IDiffObj],
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(
    ([tagTitle, videosDiffObj]: [string, IDiffObj]) =>
      window.api.updateDbTagVideos(tagTitle, videosDiffObj).then(() => tagTitle),
    {
      onSuccess: (tagTitle) => {
        queryClient.invalidateQueries(['availableTags'])
        queryClient.invalidateQueries(['allTags'])
        queryClient.invalidateQueries(['allTags', tagTitle])
      }
    }
  ).mutate
}
