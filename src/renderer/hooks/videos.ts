import {
  UseMutateFunction,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { IDiffObj, IVideoFull, IVideoWithRelated } from '../types';

export function useAvailableVideos(): UseQueryResult<string[], unknown> {
  return useQuery('availableVideos', () => window.api.getAvailableVideos(), {
    staleTime: Infinity,
  });
}

export function useAllVideos(): UseQueryResult<IVideoFull[], unknown> {
  return useQuery('allVideos', () => window.api.getAllVideos(), {
    staleTime: Infinity,
  });
}

export function useVideo(
  videoPath: string,
): UseQueryResult<IVideoWithRelated, unknown> {
  return useQuery(
    ['allVideos', videoPath],
    () => window.api.getVideo(videoPath),
    {
      staleTime: Infinity,
    },
  );
}

export function useCreateVideos(): [
  UseMutateFunction<unknown, unknown, string[], unknown>,
  boolean,
] {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (videoPaths: string[]) => window.api.addVideos(videoPaths),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['availableVideos']);
        queryClient.invalidateQueries(['allVideos']);
      },
    },
  );
  return [mutation.mutate, mutation.isLoading];
}

export function useGenerateTgp(): [
  UseMutateFunction<unknown, unknown, string, unknown>,
  boolean,
] {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (videoPath: string) =>
      window.api.generateTgp(videoPath).then(() => videoPath),
    {
      onSuccess: (videoPath) => {
        queryClient.invalidateQueries(['availableVideos']);
        queryClient.invalidateQueries(['allVideos']);
        queryClient.invalidateQueries(['allVideos', videoPath]);
      },
    },
  );
  return [mutation.mutate, mutation.isLoading];
}

export function useGenerateMissingTgps(): [
  UseMutateFunction<unknown, unknown, void, unknown>,
  boolean,
] {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => window.api.generateMissingTgps(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableVideos']);
      queryClient.invalidateQueries(['allVideos']);
    },
  });
  return [mutation.mutate, mutation.isLoading];
}

export function useDeleteVideo(): UseMutateFunction<
  unknown,
  unknown,
  string,
  unknown
> {
  const queryClient = useQueryClient();
  return useMutation(
    (videoPathToRemove: string) =>
      window.api.deleteDbVideo(videoPathToRemove).then(() => videoPathToRemove),
    {
      onSuccess: (videoPathToRemove) => {
        queryClient.invalidateQueries(['availableVideos']);
        queryClient.invalidateQueries(['allVideos']);
        queryClient.invalidateQueries(['allVideos', videoPathToRemove]);
      },
    },
  ).mutate;
}

export function useDeleteMissingVideos(): [
  UseMutateFunction<unknown, unknown, void, unknown>,
  boolean,
] {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => window.api.deleteMissingDbVideos(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['availableVideos']);
      queryClient.invalidateQueries(['allVideos']);
    },
  });
  return [mutation.mutate, mutation.isLoading];
}

export function useUpdateVideoRelations(): UseMutateFunction<
  string,
  unknown,
  [string, IDiffObj, IDiffObj],
  unknown
> {
  const queryClient = useQueryClient();
  return useMutation(
    ([videoPath, tagsDiffObj, galleriesDiffObj]: [
      string,
      IDiffObj,
      IDiffObj,
    ]) => {
      return Promise.all([
        window.api.updateDbVideoTags(videoPath, tagsDiffObj),
        window.api.updateDbVideoGalleries(videoPath, galleriesDiffObj),
      ]).then(() => videoPath);
    },
    {
      onSuccess: (videoPath) => {
        queryClient.invalidateQueries(['availableVideos']);
        queryClient.invalidateQueries(['allVideos']);
        queryClient.invalidateQueries(['allVideos', videoPath]);
      },
    },
  ).mutate;
}
