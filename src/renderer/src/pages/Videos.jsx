import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'
import { Context } from '../App.jsx'
import VideosView from '../views/videos/Videos.jsx'

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

  return (
    <VideosView
      setFilterText={setFilterText}
      dbVideos={dbVideos}
      handleDeleteVideo={handleDeleteVideo}
      filterText={filterText}
      setVideoInputData={setVideoInputData}
      videoInputData={videoInputData}
      isUploading={isUploading}
      handleCreateVideos={handleCreateVideos}
      isGeneratingTgps={isGeneratingTgps}
      handleGenerateMissingTgps={handleGenerateMissingTgps}
      isDeletingVideos={isDeletingVideos}
      handleDeleteMissingVideos={handleDeleteMissingVideos}
    />
  )
}
