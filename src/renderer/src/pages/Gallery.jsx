import * as React from 'react'
import { useParams } from 'react-router'
import { useGallery } from '../hooks/galleries'
import { useAllVideos } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import GalleryView from '../views/galleries/Gallery'

export default function Gallery() {
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const allVideos = useAllVideos().data || []

  let { galleryPath } = useParams()
  galleryPath = decodeURIComponent(galleryPath)
  const gallery = useGallery(galleryPath)

  React.useEffect(() => {
    if (!gallery.isLoading)
      setSelectedVideos(new Set(gallery.data.videos.map((video) => video.filePath)))
  }, [gallery.isLoading])

  if (gallery.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <GalleryView
      galleryPath={galleryPath}
      galleryImages={gallery.data.images}
      allVideos={allVideos}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
    />
  )
}
