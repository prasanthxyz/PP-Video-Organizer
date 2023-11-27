import * as React from 'react'
import { Button, Spinner, Stack, Table } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter.js'
import VideoRow from '../components/VideoRow.jsx'

export default function Videos() {
  const [dbVideos, setDbVideos] = React.useState([])
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
          {dbVideos.map((videoPath) => (
            <VideoRow
              videoPath={videoPath.filePath}
              deleteVideo={handleDeleteVideo}
              key={videoPath.filePath}
            />
          ))}
        </tbody>
      </Table>
    </>
  )

  const addVideoForm = (
    <div>
      <input id="filesInput" type="file" multiple="multiple" onChange={updateVideoInputData} />
      {isUploading ? (
        <>
          <Spinner /> Generating TGPs...
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
    </div>
  )
  return (
    <div>
      <Stack direction="vertical">
        <div className="d-flex mt-3">
          {isGeneratingTgps ? (
            <>
              <Spinner /> Generating TGPs...
            </>
          ) : (
            <Button size="sm" onClick={handleGenerateMissingTgps}>
              Generate Missing TGPs
            </Button>
          )}
          {isDeletingVideos ? (
            <Spinner className="ms-auto" />
          ) : (
            <Button
              className="ms-auto"
              size="sm"
              variant="danger"
              onClick={handleDeleteMissingVideos}
            >
              Delete Missing Videos
            </Button>
          )}
        </div>
        {dbVideos.length > 0 && videosTable}
        {addVideoForm}
      </Stack>
    </div>
  )
}
