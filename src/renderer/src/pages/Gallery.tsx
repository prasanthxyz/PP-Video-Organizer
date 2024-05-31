import * as React from 'react'
import { useParams } from 'react-router'
import { IGallery } from '../../../types'
import { useGallery, useUpdateGalleryVideos } from '../hooks/galleries'
import { useAllVideos } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import GalleryView from '../views/galleries/GalleryView'

export default function Gallery(): JSX.Element {
  const [selectedVideos, setSelectedVideos] = React.useState<Set<string>>(new Set())
  const allVideos = useAllVideos()

  let { galleryPath } = useParams()
  galleryPath = decodeURIComponent(galleryPath || '')
  const gallery = useGallery(galleryPath)
  const updateGalleryVideos = useUpdateGalleryVideos()

  React.useEffect(() => {
    if (gallery.isSuccess) setSelectedVideos(new Set(gallery.data?.videos || []))
  }, [gallery.data])

  if (gallery.isLoading || allVideos.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <GalleryView
      gallery={gallery.data as IGallery}
      allVideos={allVideos.data ? allVideos.data : []}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
      updateGalleryVideos={updateGalleryVideos}
    />
  )
}
