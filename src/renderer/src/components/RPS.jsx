import _ from 'lodash'
import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import ImageGallery from 'react-image-gallery'
import mainAdapter from '../../../mainAdapter'
import VideoPlayer from './VideoPlayer'

export default function RPS({ combination, showVid, isVideoPlaying }) {
  const [galleryImages, setGalleryImages] = React.useState([])

  const videoPath = combination[0]
  const galleryPath = combination[1]

  const loadGalleryImages = async () => {
    const imagePaths = _.shuffle(await mainAdapter.getGalleryImagePaths(galleryPath))
    setGalleryImages(imagePaths.map((imagePath) => 'file:///' + imagePath.replace(/\\/g, '/')))
  }

  React.useEffect(() => {
    loadGalleryImages()
  }, [combination])

  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')
  const imgPathComponents = videoPathComponents.slice(0, videoPathComponents.length - 1)
  imgPathComponents.push('img')
  imgPathComponents.push(videoPathComponents[videoPathComponents.length - 1] + '.jpg')
  const imgPath = imgPathComponents.join('/')

  const imgSlideShow = (
    <ImageGallery
      items={galleryImages.map((path) => ({ original: path }))}
      autoPlay={true}
      lazyLoad={true}
      showThumbnails={false}
      showFullscreenButton={false}
      disableKeyDown={true}
      slideInterval={2000}
    />
  )

  const videoPlayer = <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={videoPath} />
  const tgp = <img width="100%" src={`file:///${imgPath}`} />

  return (
    <Row>
      <Col xs={9}>{showVid ? videoPlayer : tgp}</Col>
      <Col xs={3}>{galleryImages.length > 0 && imgSlideShow}</Col>
    </Row>
  )
}
