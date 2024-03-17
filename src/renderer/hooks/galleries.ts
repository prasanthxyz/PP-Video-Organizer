import {
  UseMutateFunction,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { IDiffObj, IGallery, IGalleryFull } from '../types';

export function useAvailableGalleries(): UseQueryResult<string[], unknown> {
  return useQuery(
    'availableGalleries',
    () => window.api.getAvailableGalleries(),
    {
      staleTime: Infinity,
    },
  );
}

export function useAllGalleries(): UseQueryResult<IGallery[], unknown> {
  return useQuery('allGalleries', () => window.api.getAllGalleries(), {
    staleTime: Infinity,
  });
}

export function useGallery(
  galleryPath: string,
): UseQueryResult<IGalleryFull, unknown> {
  return useQuery(
    ['allGalleries', galleryPath],
    () => window.api.getGallery(galleryPath),
    {
      staleTime: Infinity,
    },
  );
}

export function useCreateGallery(): [
  UseMutateFunction<unknown, unknown, string, unknown>,
  boolean,
] {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (galleryInput: string) => window.api.createDbGallery(galleryInput),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['availableGalleries']);
        queryClient.invalidateQueries(['allGalleries']);
      },
    },
  );
  return [mutation.mutate, mutation.isLoading];
}

export function useDeleteGallery() {
  const queryClient = useQueryClient();
  return useMutation(
    (galleryPathToRemove: string) =>
      window.api
        .deleteDbGallery(galleryPathToRemove)
        .then(() => galleryPathToRemove),
    {
      onSuccess: (galleryPathToRemove) => {
        queryClient.invalidateQueries(['availableGalleries']);
        queryClient.invalidateQueries(['allGalleries']);
        queryClient.invalidateQueries(['allGalleries', galleryPathToRemove]);
      },
    },
  ).mutate;
}

export function useDeleteMissingGalleries(): [
  UseMutateFunction<unknown, unknown, void, unknown>,
  boolean,
] {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => window.api.deleteMissingDbGalleries(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableGalleries']);
      queryClient.invalidateQueries(['allGalleries']);
    },
  });
  return [mutation.mutate, mutation.isLoading];
}

export function useUpdateGalleryVideos() {
  const queryClient = useQueryClient();
  return useMutation(
    ([galleryPath, videosDiffObj]: [string, IDiffObj]) =>
      window.api
        .updateDbGalleryVideos(galleryPath, videosDiffObj)
        .then(() => galleryPath),
    {
      onSuccess: (galleryPath) => {
        queryClient.invalidateQueries(['availableGalleries']);
        queryClient.invalidateQueries(['allGalleries']);
        queryClient.invalidateQueries(['allGalleries', galleryPath]);
      },
    },
  ).mutate;
}
