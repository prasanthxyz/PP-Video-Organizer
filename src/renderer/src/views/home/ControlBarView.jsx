import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button, Stack } from 'rsuite'

const ControlBarView = ({ showVid, setShowVid, video, gallery, handleBack, handleNext }) => (
  <Stack spacing={10} style={{ marginBottom: 2 }}>
    <Stack.Item flex={3}>
      <Stack justifyContent="space-between">
        <Button size="xs" appearance="primary" onClick={() => setShowVid(!showVid)}>
          {showVid ? 'Show TGP' : 'Show Video'}
        </Button>
        <Link to={`/video/${encodeURIComponent(video.data.id)}`}>{video.data.videoName}</Link>
      </Stack>
    </Stack.Item>
    <Stack.Item flex={1} justify="space-between" align="center">
      <Stack justifyContent="space-between">
        <Stack spacing={10}>
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
    </Stack.Item>
  </Stack>
)

export default ControlBarView
