import * as React from 'react'
import { Button, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ControlBarView = ({ showVid, setShowVid, video, gallery, handleBack, handleNext }) => (
  <>
    <Col xs={9} className="d-flex justify-content-between">
      <Button size="sm" variant="success" onClick={() => setShowVid(!showVid)}>
        {showVid ? 'Show TGP' : 'Show Video'}
      </Button>
      <Link to={`/video/${encodeURIComponent(video.data.id)}`} className="fs-6">
        {video.data.videoName}
      </Link>
    </Col>
    <Col xs={3} className="d-flex justify-content-between">
      <Link to={`/gallery/${encodeURIComponent(gallery.data.id)}`} className="fs-6">
        {gallery.data.galleryName}
      </Link>
      <div>
        <Button className="me-2" size="sm" onClick={handleBack}>
          Back
        </Button>
        <Button size="sm" onClick={handleNext}>
          Next
        </Button>
      </div>
    </Col>
  </>
)

export default ControlBarView
