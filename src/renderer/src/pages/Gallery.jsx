import * as React from 'react'
import { useParams } from 'react-router'
import { useGallery, useUpdateGalleryVideos } from '../hooks/galleries'
import { useAllVideos } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import GalleryView from '../views/galleries/GalleryView'

export default function Gallery() {
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const allVideos = useAllVideos()

  let { galleryPath } = useParams()
  galleryPath = decodeURIComponent(galleryPath)
  const gallery = useGallery(galleryPath)
  const updateGalleryVideos = useUpdateGalleryVideos()

  React.useEffect(() => {
    if (!gallery.isLoading)
      setSelectedVideos(new Set(gallery.data.videos.map((video) => video.filePath)))
  }, [gallery.isLoading])

  if (gallery.isLoading || allVideos.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <GalleryView
      gallery={gallery.data}
      allVideos={allVideos.data}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
      updateGalleryVideos={updateGalleryVideos}
    />
  )
}
