import { Button, Flex, Space } from 'antd'
import * as React from 'react'
import { Link } from 'react-router-dom'

const ControlBarView = ({ showVid, setShowVid, video, gallery, handleBack, handleNext }) => (
  <Flex gap={10} style={{ marginBottom: 5 }}>
    <Flex flex={3} justify="space-between" align="center">
      <Button size="small" onClick={() => setShowVid(!showVid)}>
        {showVid ? 'Show TGP' : 'Show Video'}
      </Button>
      <Link to={`/video/${encodeURIComponent(video.data.id)}`}>{video.data.videoName}</Link>
    </Flex>
    <Flex flex={1} justify="space-between" align="center">
      <Space>
        <Button size="small" onClick={handleBack}>
          Back
        </Button>
        <Button size="small" onClick={handleNext}>
          Next
        </Button>
      </Space>
      <Link to={`/gallery/${encodeURIComponent(gallery.data.id)}`}>{gallery.data.galleryName}</Link>
    </Flex>
  </Flex>
)

export default ControlBarView
