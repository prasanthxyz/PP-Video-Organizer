import * as React from 'react'
import { Button, Col, Row, Spinner, Table } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter.js'
import { Context } from '../App.jsx'
import FilterForm from '../components/FilterForm.jsx'
import VideoRow from '../components/VideoRow.jsx'

export default function Videos() {
  const [dbVideos, setDbVideos] = React.useState([])
  const [filterText, setFilterText] = React.useState('')
  const [isUploading, setIsUploading] = React.useState(false)
  const [isGeneratingTgps, setIsGeneratingTgps] = React.useState(false)
  const [videoInputData, setVideoInputData] = React.useState({})
  const [isDeletingVideos, setIsDeletingVideos] = React.useState(false)

  const { setHasDataChanged } = React.useContext(Context)

  const handleDeleteVideo = async (videoPathToRemove) => {
    await mainAdapter.deleteDbVideo(videoPathToRemove)
    setDbVideos(dbVideos.filter((videoPath) => videoPath.filePath !== videoPathToRemove))
    setHasDataChanged(true)
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
    setHasDataChanged(true)
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

  const inputUI = (
    <>
      <Col xs={2}>
        <label className="btn btn-primary btn-sm" htmlFor="filesInput">
          Add new Video(s)
        </label>
        <input
          id="filesInput"
          type="file"
          style={{ visibility: 'hidden' }}
          multiple="multiple"
          onChange={(e) => {
            setVideoInputData(e.target.files)
          }}
        />
      </Col>
      <Col xs={2}>
        {Array.from(videoInputData).length !== 0 &&
          (isUploading ? (
            <>
              <Spinner className="me-1" />
              <span>Generating TGPs...</span>
            </>
          ) : (
            <Button size="sm" variant="success" onClick={handleCreateVideos}>
              Submit {Array.from(videoInputData).length} file(s)
            </Button>
          ))}
      </Col>
      <Col xs={8} className="d-flex justify-content-end">
        <div>
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
        </div>
      </Col>
    </>
  )

  const videosTable = (
    <Col>
      <p className="fs-5 mt-2 mb-0">Videos</p>
      <Table>
        <tbody>
          {dbVideos
            .map((videoPath, index) => (
              <VideoRow
                index={index}
                videoPath={videoPath.filePath}
                deleteVideo={handleDeleteVideo}
                key={videoPath.filePath}
              />
            ))
            .filter((videoRow) => videoRow.key.toLowerCase().includes(filterText))}
        </tbody>
      </Table>
    </Col>
  )

  return (
    <div>
      <Row className="mt-3">
        <FilterForm setFilterText={setFilterText} />
      </Row>
      <Row className="mt-3">{inputUI}</Row>
      <Row>{dbVideos.length > 0 && videosTable}</Row>
    </div>
  )
}
