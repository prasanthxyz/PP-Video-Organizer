import { Col, Row } from 'react-bootstrap'
import VideoPlayer from '../../components/VideoPlayer'
import ImageSlideShow from '../common/ImageSlideShow'

const RPSView = ({ showVid, videoPath, isVideoPlaying, gallery, video }) => (
  <Row>
    <Col xs={9}>
      {showVid ? (
        <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={`file:///${videoPath}`} />
      ) : (
        <img width="100%" src={`file:///${video.data.tgpPath}`} />
      )}
    </Col>
    <Col xs={3}>
      {gallery.data.images.length > 0 && <ImageSlideShow galleryImages={gallery.data.images} />}
    </Col>
  </Row>
)

export default RPSView
