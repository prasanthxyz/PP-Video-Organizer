import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'
import VideoRow from '../components/VideoRow.jsx'

export default function Videos() {
  const [dbVideos, setDbVideos] = React.useState([])
  const [videoInputData, setVideoInputData] = React.useState({})

  const updateVideoInputData = (e) => {
    setVideoInputData(e.target.files)
  }

  const handleCreateVideos = async (e) => {
    const videoPaths = Array.from(videoInputData).map((video) => video.path)
    await mainAdapter.createDbVideos(videoPaths)
    document.getElementById('filesInput').value = ''
    await loadVideos()
  }

  const loadVideos = async () => {
    const videoObjects = await mainAdapter.getDbVideos()
    setDbVideos(
      videoObjects.map((videoPath) => {
        return <VideoRow videoPath={videoPath.filePath} key={videoPath.filePath} />
      })
    )
  }

  React.useEffect(() => {
    loadVideos()
  }, [])

  const addVideoForm = (
    <div>
      <input id="filesInput" type="file" multiple="multiple" onChange={updateVideoInputData} />
      <input type="button" value="submit" onClick={handleCreateVideos} />
    </div>
  )
  return (
    <div>
      {dbVideos}
      {addVideoForm}
    </div>
  )
}
