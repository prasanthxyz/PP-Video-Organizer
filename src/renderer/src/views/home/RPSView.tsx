import { UseQueryResult } from 'react-query'
import { Col, Row } from 'rsuite'
import { IGalleryFull, IVideoWithRelated } from '../../../../types'
import VideoPlayer from '../../components/VideoPlayer'
import ImageSlideShowView from '../common/ImageSlideShowView'

const RPSView = ({
  showVid,
  videoPath,
  isVideoPlaying,
  gallery,
  video
}: {
  showVid: boolean
  videoPath: string
  isVideoPlaying: boolean
  gallery: UseQueryResult<IGalleryFull, unknown>
  video: UseQueryResult<IVideoWithRelated, unknown>
}): JSX.Element => (
  <Row gutter={3}>
    <Col xs={18}>
      {showVid ? (
        <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={`file:///${videoPath}`} />
      ) : (
        <img src={`file:///${video.data ? video.data.tgpPath : ''}`} loading="lazy" width="100%" />
      )}
    </Col>
    <Col xs={6}>
      {gallery.data && gallery.data.images.length > 0 && (
        <ImageSlideShowView galleryImages={gallery.data.images} />
      )}
    </Col>
  </Row>
)

export default RPSView
