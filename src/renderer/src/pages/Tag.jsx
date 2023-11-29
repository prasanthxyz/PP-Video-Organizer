import _ from 'lodash'
import * as React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import CheckBoxGroup from '../components/CheckBoxGroup'

export default function Tag() {
  const [allVideos, setAllVideos] = React.useState([])
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const [prevSelectedVideos, setPrevSelectedVideos] = React.useState(new Set())

  let { tagTitle } = useParams()

  const loadData = async () => {
    setAllVideos((await mainAdapter.getDbVideos()).map((video) => video.filePath))
    const tagData = await mainAdapter.getDbTagData(tagTitle)
    const selectedVideos = new Set(tagData['videos'].map((video) => video.filePath))
    setSelectedVideos(selectedVideos)
    setPrevSelectedVideos(selectedVideos)
  }

  React.useEffect(() => {
    loadData()
  }, [])

  const handleUpdateRelatedVideos = async () => {
    const updateVideosObj = { add: [], remove: [] }

    for (const video of selectedVideos) {
      if (!prevSelectedVideos.has(video)) {
        updateVideosObj['add'].push(video)
      }
    }

    for (const video of prevSelectedVideos) {
      if (!selectedVideos.has(video)) {
        updateVideosObj['remove'].push(video)
      }
    }

    await mainAdapter.updateDbTagVideos(tagTitle, updateVideosObj)
    setPrevSelectedVideos(selectedVideos)
  }

  const isSelectionChanged = !_.isEqual(prevSelectedVideos, selectedVideos)

  const relatedVideos = (
    <>
      <Row>
        <Col xs={12} className="d-flex align-items-center justify-content-between">
          <h6 className="fs-4">Associated Videos</h6>
          {isSelectionChanged && (
            <Button variant="success" size="sm" onClick={handleUpdateRelatedVideos}>
              Save
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <CheckBoxGroup
            allItems={allVideos}
            selectedItems={selectedVideos}
            update={setSelectedVideos}
          />
        </Col>
      </Row>
    </>
  )

  return (
    <>
      <Row>
        <h3 className="display-6 text-center mt-2">{tagTitle}</h3>
      </Row>
      <Row className="d-flex justify-content-center">
        <Col xs={6}>{relatedVideos}</Col>
      </Row>
    </>
  )
}
