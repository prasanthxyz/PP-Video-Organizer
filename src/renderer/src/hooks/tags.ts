import {
  UseMutateFunction,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import bi from '../../../backend_interface'
import { IDiffObj, ITag, ITagFull } from '../../../types'

export function useAvailableTags(): UseQueryResult<string[], unknown> {
  return useQuery(
    'availableTags',
    () => fetch(`${bi.SERVER_URL}/${bi.GET_AVAILABLE_TAGS}`).then((res) => res.json()),
    {
      staleTime: Infinity
    }
  )
}

export function useAllTags(): UseQueryResult<ITag[], unknown> {
  return useQuery(
    'allTags',
    () => fetch(`${bi.SERVER_URL}/${bi.GET_ALL_TAGS}`).then((res) => res.json()),
    {
      staleTime: Infinity
    }
  )
}

export function useTag(tagTitle: string): UseQueryResult<ITagFull, unknown> {
  return useQuery(
    ['allTags', tagTitle],
    () =>
      fetch(`${bi.SERVER_URL}/${bi.GET_TAG}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagTitle: tagTitle })
      }).then((res) => res.json()),
    {
      staleTime: Infinity
    }
  )
}

export function useCreateTags(): [UseMutateFunction<unknown, unknown, string, unknown>, boolean] {
  const queryClient = useQueryClient()
  const mutation = useMutation(
    (tagInput: string) =>
      fetch(`${bi.SERVER_URL}/${bi.CREATE_TAGS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagTitles: tagInput })
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['availableTags'])
        queryClient.invalidateQueries(['allTags'])
      }
    }
  )
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteTag(): UseMutateFunction<unknown, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation(
    (tagTitleToRemove: string) =>
      fetch(`${bi.SERVER_URL}/${bi.DELETE_TAG}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagTitle: tagTitleToRemove })
      }).then(() => tagTitleToRemove),
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
      fetch(`${bi.SERVER_URL}/${bi.UPDATE_TAG_VIDEOS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagTitle: tagTitle, diffObj: videosDiffObj })
      }).then(() => tagTitle),
    {
      onSuccess: (tagTitle) => {
        queryClient.invalidateQueries(['availableTags'])
        queryClient.invalidateQueries(['allTags'])
        queryClient.invalidateQueries(['allTags', tagTitle])
      }
    }
  ).mutate
}
