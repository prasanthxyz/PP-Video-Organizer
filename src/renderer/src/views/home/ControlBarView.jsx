import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Row, Stack } from 'rsuite'

const ControlBarView = ({ showVid, setShowVid, video, gallery, handleBack, handleNext }) => (
  <Row gutter={3} style={{ marginBottom: '0.2rem' }}>
    <Col xs={18}>
      <Stack justifyContent="space-between">
        <Link to={`/video/${encodeURIComponent(video.data.id)}`}>{video.data.videoName}</Link>
        <Button size="xs" appearance="primary" onClick={() => setShowVid(!showVid)}>
          {showVid ? 'Show TGP' : 'Show Video'}
        </Button>
      </Stack>
    </Col>
    <Col xs={6}>
      <Stack justifyContent="space-between">
        <Stack spacing={3}>
          <Button size="xs" appearance="ghost" color="green" onClick={handleBack}>
            Back
          </Button>
          <Button size="xs" appearance="ghost" color="green" onClick={handleNext}>
            Next
          </Button>
        </Stack>
        <Link to={`/gallery/${encodeURIComponent(gallery.data.id)}`}>
          {gallery.data.galleryName}
        </Link>
      </Stack>
    </Col>
  </Row>
)

export default ControlBarView
