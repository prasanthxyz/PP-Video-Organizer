import _ from 'lodash'
import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter'
import { getImgPathAndVideoName } from '../utils'
import ImageSlideShow from './ImageSlideShow'
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

  const videoPlayer = <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={videoPath} />
  const tgp = <img width="100%" src={`file:///${getImgPathAndVideoName(videoPath).imgPath}`} />

  return (
    <Row>
      <Col xs={9}>{showVid ? videoPlayer : tgp}</Col>
      <Col xs={3}>
        {galleryImages.length > 0 && <ImageSlideShow galleryImages={galleryImages} />}
      </Col>
    </Row>
  )
}
