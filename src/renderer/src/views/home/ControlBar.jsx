import * as React from 'react'
import { Button, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getImgPathAndVideoName, getNameAndPathComponents } from '../../utils'

function ControlBar({ showVid, setShowVid, videoPath, galleryPath, handleBack, handleNext }) {
  return (
    <>
      <Col xs={9} className="d-flex justify-content-between">
        <Button size="sm" variant="success" onClick={() => setShowVid(!showVid)}>
          {showVid ? 'Show TGP' : 'Show Video'}
        </Button>
        <Link to={`/video/${videoPath}`} className="fs-6">
          {getImgPathAndVideoName(videoPath).videoName}
        </Link>
      </Col>
      <Col xs={3} className="d-flex justify-content-between">
        <Link to={`/gallery/${galleryPath}`} className="fs-6">
          {getNameAndPathComponents(galleryPath)[0]}
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
}

export default ControlBar
