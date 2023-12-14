import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import ImageSlideShow from '../common/ImageSlideShow.jsx'
import RelatedVideos from './RelatedVideos.jsx'

export default function Gallery({
  galleryPath,
  galleryImages,
  allVideos,
  selectedVideos,
  setSelectedVideos
}) {
  return (
    <>
      <Row>
        <Col>
          <h3 className="display-6 text-center">{galleryPath}</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          {galleryImages.length > 0 && <ImageSlideShow galleryImages={galleryImages} />}
        </Col>
        <Col xs={6}>
          <RelatedVideos
            allVideos={allVideos}
            selectedVideos={selectedVideos}
            setSelectedVideos={setSelectedVideos}
            galleryPath={galleryPath}
          />
        </Col>
      </Row>
    </>
  )
}
