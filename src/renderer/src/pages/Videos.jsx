import * as React from 'react'
import { Button, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter.js'
import VideoRow from '../components/VideoRow.jsx'

export default function Videos() {
  const [dbVideos, setDbVideos] = React.useState([])
  const [filterText, setFilterText] = React.useState('')
  const [isUploading, setIsUploading] = React.useState(false)
  const [isGeneratingTgps, setIsGeneratingTgps] = React.useState(false)
  const [videoInputData, setVideoInputData] = React.useState({})
  const [isDeletingVideos, setIsDeletingVideos] = React.useState(false)

  const updateVideoInputData = (e) => {
    setVideoInputData(e.target.files)
  }

  const handleDeleteVideo = async (videoPathToRemove) => {
    await mainAdapter.deleteDbVideo(videoPathToRemove)
    setDbVideos(dbVideos.filter((videoPath) => videoPath.filePath !== videoPathToRemove))
  }

  const handleCreateVideos = async (e) => {
    setIsUploading(true)
    const videoPaths = Array.from(videoInputData).map((video) => video.path)
    await mainAdapter.createDbVideos(videoPaths)
    for (const videoPath of videoPaths) {
      await mainAdapter.generateTgp(videoPath)
    }
    setIsUploading(false)
    document.getElementById('filesInput').value = ''
    await loadVideos()
  }

  const loadVideos = async () => {
    setDbVideos(await mainAdapter.getDbVideos())
  }

  const handleGenerateMissingTgps = async () => {
    setIsGeneratingTgps(true)
    await mainAdapter.generateMissingTgps()
    setDbVideos([])
    await loadVideos()
    setIsGeneratingTgps(false)
  }

  const handleDeleteMissingVideos = async () => {
    setIsDeletingVideos(true)
    await mainAdapter.deleteMissingDbVideos()
    setDbVideos([])
    await loadVideos()
    setIsDeletingVideos(false)
  }

  React.useEffect(() => {
    loadVideos()
  }, [])

  const videosTable = (
    <>
      <p className="fs-5 mt-2 mb-0">Videos</p>
      <Table>
        <tbody>
          {dbVideos
            .filter((videoPath) => videoPath.filePath.toLowerCase().includes(filterText))
            .map((videoPath, index) => (
              <VideoRow
                index={index}
                videoPath={videoPath.filePath}
                deleteVideo={handleDeleteVideo}
                key={videoPath.filePath}
              />
            ))}
        </tbody>
      </Table>
    </>
  )

  const inputUI = (
    <>
      <Col xs={3}>
        <input id="filesInput" type="file" multiple="multiple" onChange={updateVideoInputData} />
      </Col>
      <Col xs={3}>
        {isUploading ? (
          <>
            <Spinner className="me-1" />
            <span>Generating TGPs...</span>
          </>
        ) : (
          <Button
            size="sm"
            variant="success"
            onClick={handleCreateVideos}
            disabled={Array.from(videoInputData).length === 0}
          >
            Add new Video(s)
          </Button>
        )}
      </Col>
      <Col xs={6} className="d-flex justify-content-end">
        {isGeneratingTgps ? (
          <>
            <Spinner className="me-1" />
            <span className="me-1">Generating TGPs...</span>
          </>
        ) : (
          <Button className="me-3" size="sm" onClick={handleGenerateMissingTgps}>
            Generate Missing TGPs
          </Button>
        )}
        {isDeletingVideos ? (
          <Spinner />
        ) : (
          <Button size="sm" variant="danger" onClick={handleDeleteMissingVideos}>
            Delete Missing Videos
          </Button>
        )}
      </Col>
    </>
  )
  return (
    <div>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <Form.Group as={Row}>
            <Form.Label column xs="2">
              Filter
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                onChange={(e) => setFilterText(e.target.value.toLowerCase())}
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">{inputUI}</Row>
      <Row>{dbVideos.length > 0 && videosTable}</Row>
    </div>
  )
}
