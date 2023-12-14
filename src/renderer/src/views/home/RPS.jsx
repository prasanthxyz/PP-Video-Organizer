import { Col, Row } from 'react-bootstrap'
import ImageSlideShow from '../common/ImageSlideShow'
import VideoPlayer from '../../components/VideoPlayer'

function RPS({ showVid, getImgPathAndVideoName, galleryImages, videoPath, isVideoPlaying }) {
  return (
    <Row>
      <Col xs={9}>
        {showVid ? (
          <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={videoPath} />
        ) : (
          <img width="100%" src={`file:///${getImgPathAndVideoName(videoPath).imgPath}`} />
        )}
      </Col>
      <Col xs={3}>
        {galleryImages.length > 0 && <ImageSlideShow galleryImages={galleryImages} />}
      </Col>
    </Row>
  )
}

export default RPS
