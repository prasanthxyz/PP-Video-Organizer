import _ from 'lodash'
import * as React from 'react'
import ImageGallery from 'react-image-gallery'
import mainAdapter from '../../../mainAdapter'
import VideoPlayer from './VideoPlayer'
import { Button, Col, Row, Stack } from 'react-bootstrap'

export default function RPS({ combination, showVid }) {
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
    />
  )

  const videoPlayer = <VideoPlayer autoplay={false} controls={true} sources={videoPath} />
  const tgp = <img width="100%" src={`file:///${getImgPath()}`} />

  return (
    <>
      <Row>
        <Col xs={9}>
          <p className="fs-5 text-end">{videoName}</p>
          {showVid ? videoPlayer : tgp}
        </Col>
        <Col xs={3}>
          <p className="fs-5">{galleryName}</p>
          {galleryImages.length > 0 && imgSlideShow}
        </Col>
      </Row>
    </>
  )
}
