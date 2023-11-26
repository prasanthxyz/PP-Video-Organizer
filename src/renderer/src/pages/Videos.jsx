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
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>File</th>
          <th>TGP</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
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
  )

  const addVideoForm = (
    <div>
      <input id="filesInput" type="file" multiple="multiple" onChange={updateVideoInputData} />
      {isUploading ? (
        <>
          <Spinner /> Generating TGPs...
        </>
      ) : (
        <Button onClick={handleCreateVideos}>Add</Button>
      )}
    </div>
  )
  return (
    <div>
      <Stack direction="vertical">
        <Stack direction="horizontal">
          {isGeneratingTgps ? (
            <>
              <Spinner /> Generating TGPs...
            </>
          ) : (
            <Button onClick={handleGenerateMissingTgps}>Generate Missing TGPs</Button>
          )}
          {isDeletingVideos ? (
            <Spinner />
          ) : (
            <Button onClick={handleDeleteMissingVideos}>Delete Missing Videos</Button>
          )}
        </Stack>
        {dbVideos.length > 0 && videosTable}
        {addVideoForm}
      </Stack>
    </div>
  )
}
