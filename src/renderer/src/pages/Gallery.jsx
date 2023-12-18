import * as React from 'react'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { useAllVideos } from '../hooks/videos'
import GalleryView from '../views/galleries/Gallery'

export default function Gallery() {
  const [galleryImages, setGalleryImages] = React.useState([])
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())

  const allVideos = useAllVideos().data

  let { galleryPath } = useParams()
  galleryPath = decodeURIComponent(galleryPath)

  const loadData = async () => {
    setGalleryImages(
      (await mainAdapter.getGalleryImagePaths(galleryPath)).map(
        (imagePath) => 'file:///' + imagePath.replace(/\\/g, '/')
      )
    )
    setSelectedVideos(
      new Set(
        (await mainAdapter.getDbGalleryData(galleryPath))['videos'].map((video) => video.filePath)
      )
    )
  }

  React.useEffect(() => {
    loadData()
  }, [])

  return (
    <GalleryView
      galleryPath={galleryPath}
      galleryImages={galleryImages}
      allVideos={allVideos}
      selectedVideos={selectedVideos}
      setSelectedVideos={setSelectedVideos}
    />
  )
}
