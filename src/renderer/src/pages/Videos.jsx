import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'
import { Context } from '../App.jsx'
import VideosView from '../views/videos/Videos.jsx'
import { useAllVideos } from '../hooks/videos.js'

export default function Videos() {
  const [filterText, setFilterText] = React.useState('')
  const [isUploading, setIsUploading] = React.useState(false)
  const [isGeneratingTgps, setIsGeneratingTgps] = React.useState(false)
  const [videoInputData, setVideoInputData] = React.useState({})
  const [isDeletingVideos, setIsDeletingVideos] = React.useState(false)

  const dbVideos = useAllVideos().data || []
  const { setHasDataChanged } = React.useContext(Context)

  const handleDeleteVideo = async (videoPathToRemove) => {
    await mainAdapter.deleteDbVideo(videoPathToRemove)
    setHasDataChanged(true)
  }

  const handleCreateVideos = async (e) => {
    setIsUploading(true)
    const videoPaths = Array.from(videoInputData).map((video) => video.path)
    await mainAdapter.addVideos(videoPaths)
    setIsUploading(false)
    setHasDataChanged(true)
  }

  const handleGenerateMissingTgps = async () => {
    setIsGeneratingTgps(true)
    await mainAdapter.generateMissingTgps()
    setIsGeneratingTgps(false)
    // setHasDataChanged(true)
  }

  const handleDeleteMissingVideos = async () => {
    setIsDeletingVideos(true)
    await mainAdapter.deleteMissingDbVideos()
    setIsDeletingVideos(false)
    setHasDataChanged(true)
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
