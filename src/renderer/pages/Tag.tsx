import * as React from 'react';
import { useParams } from 'react-router';
import { IVideoModel } from '../../main/database/VideoModel';
import { useTag, useUpdateTagVideos } from '../hooks/tags';
import { useAllVideos } from '../hooks/videos';
import { ITagFull } from '../types';
import CenterMessage from '../views/app/CenterMessage';
import TagView from '../views/tags/TagView';

export default function Tag() {
  const [selectedVideos, setSelectedVideos] = React.useState<Set<string>>(
    new Set(),
  );
  const allVideos = useAllVideos();

  let { tagTitle } = useParams();
  tagTitle = decodeURIComponent(tagTitle as string);
  const tag = useTag(tagTitle);
  const updateTagVideos = useUpdateTagVideos();

  React.useEffect(() => {
    if (!tag.isLoading)
      setSelectedVideos(
        new Set(
          tag.data
            ? tag.data.videos.map((video: IVideoModel) => video.filePath)
            : [],
        ),
      );
  }, [tag.isLoading]);

  if (tag.isLoading || allVideos.isLoading)
    return <CenterMessage msg="Loading..." />;

  return (
    <TagView
      tag={tag.data as ITagFull}
      allVideos={allVideos.data ? allVideos.data : []}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
      updateTagVideos={updateTagVideos}
    />
  );
}
