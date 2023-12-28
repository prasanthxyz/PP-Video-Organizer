import { Col, Row, Typography } from 'antd'
import * as React from 'react'
import CheckBoxGroups from '../../components/CheckBoxGroups.jsx'
import ImageSlideShowView from '../common/ImageSlideShowView.jsx'

const GalleryView = ({
  gallery,
  allVideos,
  selectedVideos,
  setSelectedVideos,
  updateGalleryVideos
}) => (
  <>
    <Typography.Title level={4} style={{ textAlign: 'center' }}>
      {gallery.galleryPath}
    </Typography.Title>
    <Row gutter={10}>
      <Col xs={12}>
        {gallery.images.length > 0 ? (
          <ImageSlideShowView galleryImages={gallery.images} />
        ) : (
          <div>No images found!</div>
        )}
      </Col>
      <Col xs={12}>
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
