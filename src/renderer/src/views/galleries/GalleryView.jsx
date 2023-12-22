import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import CheckBoxGroups from '../../components/CheckBoxGroups.jsx'
import ImageSlideShow from '../../components/ImageSlideShow.jsx'

const GalleryView = ({
  gallery,
  allVideos,
  selectedVideos,
  setSelectedVideos,
  updateGalleryVideos
}) => (
  <>
    <Row>
      <Col>
        <h3 className="display-6 text-center">{gallery.galleryPath}</h3>
      </Col>
    </Row>
    <Row>
      <Col xs={6}>
        {gallery.images.length > 0 && <ImageSlideShow galleryImages={gallery.images} />}
      </Col>
      <Col xs={6}>
        <CheckBoxGroups
          lists={[
            {
              heading: 'Videos',
              allItems: allVideos.map((v) => v.id),
              selectedItems: selectedVideos
            }
          ]}
          saveHandlers={[setSelectedVideos]}
          postSave={async ([videosDiffObj]) => {
            await updateGalleryVideos([gallery.galleryPath, videosDiffObj])
          }}
          useDiffObj={true}
        />
      </Col>
    </Row>
  </>
)

export default GalleryView
