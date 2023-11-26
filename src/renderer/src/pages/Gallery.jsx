import _ from 'lodash'
import * as React from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { Stack } from 'react-bootstrap'

export default function Gallery() {
  const [galleryImages, setGalleryImages] = React.useState([])

  let { galleryPath } = useParams()

  const loadGalleryImages = async () => {
    const imagePaths = await mainAdapter.getGalleryImagePaths(galleryPath)
    setGalleryImages(imagePaths.map((imagePath) => 'file:///' + imagePath.replace(/\\/g, '/')))
  }

  React.useEffect(() => {
    loadGalleryImages()
  }, [])

  const galleryPathComponents = galleryPath.replace(/\\/g, '/').split('/')
  const galleryName = galleryPathComponents[galleryPathComponents.length - 1]
  const imgSlideShow = (
    <ImageGallery
      items={galleryImages.map((path) => ({ original: path }))}
      autoPlay={true}
      lazyLoad={true}
      showThumbnails={false}
      showFullscreenButton={false}
      disableKeyDown={true}
      slideInterval={2000}
      startIndex={_.random(galleryImages.length - 1)}
    />
  )

  return (
    <Stack direction="vertical">
      <h3>{galleryName}</h3>
      {galleryImages.length > 0 && imgSlideShow}
    </Stack>
  )
}
