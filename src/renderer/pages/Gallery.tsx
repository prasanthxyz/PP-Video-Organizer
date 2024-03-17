import * as React from 'react';
import { useParams } from 'react-router';
import { useGallery, useUpdateGalleryVideos } from '../hooks/galleries';
import { useAllVideos } from '../hooks/videos';
import CenterMessage from '../views/app/CenterMessage';
import GalleryView from '../views/galleries/GalleryView';
import { IVideoModel } from '../../main/database/VideoModel';
import { IGalleryFull } from '../types';

export default function Gallery() {
  const [selectedVideos, setSelectedVideos] = React.useState<Set<string>>(
    new Set(),
  );
  const allVideos = useAllVideos();

  let { galleryPath } = useParams();
  galleryPath = decodeURIComponent(galleryPath || '');
  const gallery = useGallery(galleryPath);
  const updateGalleryVideos = useUpdateGalleryVideos();

  React.useEffect(() => {
    if (!gallery.isLoading)
      setSelectedVideos(
        new Set(
          gallery.data?.videos?.map((video: IVideoModel) => video.filePath),
        ),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery.isLoading]);

  if (gallery.isLoading || allVideos.isLoading)
    return <CenterMessage msg="Loading..." />;

  return (
    <GalleryView
      gallery={gallery.data as IGalleryFull}
      allVideos={allVideos.data ? allVideos.data : []}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
      updateGalleryVideos={updateGalleryVideos}
    />
  );
}
