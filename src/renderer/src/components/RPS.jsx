import { Button, HStack } from '@chakra-ui/react'
import _ from 'lodash'
import * as React from 'react'
import ImageGallery from 'react-image-gallery'
import mainAdapter from '../../../mainAdapter'
import VideoPlayer from './VideoPlayer'

export default function RPS({ combination }) {
  const [galleryImages, setGalleryImages] = React.useState([])
  const [showVid, setShowVid] = React.useState(false)

  const videoPath = combination[0]
  const galleryPath = combination[1]

  const toggleTgpVid = () => {
    setShowVid(!showVid)
  }

  const loadGalleryImages = async () => {
    const imagePaths = await mainAdapter.getGalleryImagePaths(galleryPath)
    setGalleryImages(imagePaths.map((imagePath) => 'file:///' + imagePath.replace(/\\/g, '/')))
  }

  React.useEffect(() => {
    loadGalleryImages()
  }, [combination])

  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')
  const videoName = videoPathComponents[videoPathComponents.length - 1]
  const getImgPath = () => {
    const imgPathComponents = videoPathComponents.slice(0, videoPathComponents.length - 1)
    imgPathComponents.push('img')
    imgPathComponents.push(videoPathComponents[videoPathComponents.length - 1] + '.jpg')
    return imgPathComponents.join('/')
  }

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

  const videoPlayer = <VideoPlayer autoplay={false} controls={true} sources={videoPath} />
  const tgp = <img src={`file:///${getImgPath()}`} />

  return (
    <HStack>
      <div>
        {videoName}
        {showVid ? videoPlayer : tgp}
        <Button onClick={toggleTgpVid}>{showVid ? 'Show TGP' : 'Show Video'}</Button>
      </div>
      <div>
        <h3>{galleryName}</h3>
        {galleryImages.length > 0 && imgSlideShow}
      </div>
    </HStack>
  )
}
