import * as React from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter.js'
import { Context } from '../App.jsx'
import FilterForm from '../components/FilterForm.jsx'
import SpinnerOr from '../components/SpinnerOr.jsx'
import VideoRow from '../components/VideoRow.jsx'

export default function Videos() {
  const [dbVideos, setDbVideos] = React.useState([])
  const [filterText, setFilterText] = React.useState('')
  const [isUploading, setIsUploading] = React.useState(false)
  const [isGeneratingTgps, setIsGeneratingTgps] = React.useState(false)
  const [videoInputData, setVideoInputData] = React.useState({})
  const [isDeletingVideos, setIsDeletingVideos] = React.useState(false)

  const { setHasDataChanged } = React.useContext(Context)

  React.useEffect(() => {
    loadVideos()
  }, [])

  const handleDeleteVideo = async (videoPathToRemove) => {
    await mainAdapter.deleteDbVideo(videoPathToRemove)
    setDbVideos(dbVideos.filter((videoPath) => videoPath.filePath !== videoPathToRemove))
    setHasDataChanged(true)
  }

  const handleCreateVideos = async (e) => {
    setIsUploading(true)
    const videoPaths = Array.from(videoInputData).map((video) => video.path)
    await mainAdapter.addVideos(videoPaths)
    setIsUploading(false)
    document.getElementById('filesInput').value = ''
    await loadVideos()
    setHasDataChanged(true)
  }

  const loadVideos = async () => {
    setDbVideos(
      (await mainAdapter.getDbVideos()).map((video, index) => ({ ...video, sl: index + 1 }))
    )
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

  const inputUI = (
    <>
      <Col xs={6} className="d-flex">
        <label className="btn btn-primary btn-sm" htmlFor="filesInput">
          Add new Video(s)
        </label>
        <input
          id="filesInput"
          type="file"
          style={{ visibility: 'hidden', width: '20px' }}
          multiple="multiple"
          onChange={(e) => {
            setVideoInputData(e.target.files)
          }}
        />
        {Array.from(videoInputData).length !== 0 && (
          <SpinnerOr isSpinner={isUploading} msg="Generating TGPs...">
            <Button size="sm" variant="success" onClick={handleCreateVideos}>
              Submit {Array.from(videoInputData).length} file(s)
            </Button>
          </SpinnerOr>
        )}
      </Col>
      <Col xs={6} className="d-flex justify-content-end">
        <SpinnerOr isSpinner={isGeneratingTgps} msg="Generating TGPs...">
          <Button className="me-3" size="sm" onClick={handleGenerateMissingTgps}>
            Generate Missing TGPs
          </Button>
        </SpinnerOr>
        <SpinnerOr isSpinner={isDeletingVideos} msg="Deleting...">
          <Button size="sm" variant="danger" onClick={handleDeleteMissingVideos}>
            Delete Missing Videos
          </Button>
        </SpinnerOr>
      </Col>
    </>
  )

  const videosTable = (
    <Col>
      <p className="fs-5 mt-2 mb-0">Videos</p>
      <Table size="sm">
        <thead>
          <tr>
            <th>SL</th>
            <th>Video</th>
            <th></th>
            <th>Error</th>
            <th>Quality</th>
            <th>Width</th>
            <th>Height</th>
            <th>FR</th>
            <th>BR/1000</th>
            <th>Minutes</th>
          </tr>
        </thead>
        <tbody>
          {dbVideos
            .map((video) => (
              <VideoRow video={video} deleteVideo={handleDeleteVideo} key={video.filePath} />
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
