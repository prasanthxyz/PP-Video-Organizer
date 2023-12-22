import * as React from 'react'
import { Link } from 'react-router-dom'

const ControlBarView = ({ showVid, setShowVid, video, gallery, handleBack, handleNext }) => (
  <div id="controlbar" className="d-flex">
    <div className="width75 d-flex space-between">
      <button onClick={() => setShowVid(!showVid)}>{showVid ? 'Show TGP' : 'Show Video'}</button>
      <Link to={`/video/${encodeURIComponent(video.data.id)}`} className="fs-6">
        {video.data.videoName}
      </Link>
    </div>
    <div className="width25 d-flex space-between">
      <div>
        <button className="me-2" onClick={handleBack}>
          Back
        </button>
        <button onClick={handleNext}>Next</button>
      </div>
      <Link to={`/gallery/${encodeURIComponent(gallery.data.id)}`} className="fs-6">
        {gallery.data.galleryName}
      </Link>
    </div>
  </div>
)

export default ControlBarView
