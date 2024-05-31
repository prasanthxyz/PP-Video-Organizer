import {
  QueryClient,
  UseMutateFunction,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import bi from '../../../backend_interface'
import { IDiffObj, ITag } from '../../../types'

const QUERIES = {
  fetchAllTags: async (): Promise<ITag[]> =>
    fetch(`${bi.SERVER_URL}/${bi.GET_ALL_TAGS}`).then((res) => res.json()),

  fetchTag: async (tagTitle: string): Promise<ITag> =>
    fetch(`${bi.SERVER_URL}/${bi.GET_TAG}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagTitle: tagTitle })
    }).then((res) => res.json()),

  createTags: async (tagInput: string): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.CREATE_TAGS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagTitles: tagInput })
    }),

  deleteTag: async (tagTitleToRemove: string): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.DELETE_TAG}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagTitle: tagTitleToRemove })
    }),

  updateTagVideos: async (tagTitle: string, videosDiffObj: IDiffObj): Promise<Response> =>
    fetch(`${bi.SERVER_URL}/${bi.UPDATE_TAG_VIDEOS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagTitle: tagTitle, diffObj: videosDiffObj })
    })
}

const INVALIDATE_CACHES = {
  createTags: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([queryClient.invalidateQueries(['allTags'])]),

  deleteTag: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['allTags']),
      queryClient.invalidateQueries(['allVideos'])
    ]),

  updateTagVideos: async (queryClient: QueryClient): Promise<void[]> =>
    Promise.all([
      queryClient.invalidateQueries(['allTags']),
      queryClient.invalidateQueries(['allVideos'])
    ])
}

export function useAllTags(): UseQueryResult<ITag[], unknown> {
  return useQuery('allTags', QUERIES.fetchAllTags, {
    staleTime: Infinity
  })
}

export function useTag(tagTitle: string): UseQueryResult<ITag, unknown> {
  return useQuery(['allTags', tagTitle], () => QUERIES.fetchTag(tagTitle), {
    staleTime: Infinity
  })
}

export function useCreateTags(): [UseMutateFunction<unknown, unknown, string, unknown>, boolean] {
  const queryClient = useQueryClient()
  const mutation = useMutation((tagInput: string) => QUERIES.createTags(tagInput), {
    onSuccess: () => INVALIDATE_CACHES.createTags(queryClient)
  })
  return [mutation.mutate, mutation.isLoading]
}

export function useDeleteTag(): UseMutateFunction<unknown, unknown, string, unknown> {
  const queryClient = useQueryClient()
  return useMutation((tagTitleToRemove: string) => QUERIES.deleteTag(tagTitleToRemove), {
    onSuccess: () => INVALIDATE_CACHES.deleteTag(queryClient)
  }).mutate
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
      QUERIES.updateTagVideos(tagTitle, videosDiffObj),
    {
      onSuccess: () => INVALIDATE_CACHES.updateTagVideos(queryClient)
    }
  ).mutate
}
