import * as React from 'react'
import {
  useAllVideos,
  useCreateVideos,
  useDeleteMissingVideos,
  useDeleteVideo,
  useGenerateMissingTgps
} from '../hooks/videos.js'
import CenterMessage from '../views/app/CenterMessage.jsx'
import VideosView from '../views/videos/VideosView.jsx'

export default function Videos() {
  const [filterText, setFilterText] = React.useState('')
  const [videoInputData, setVideoInputData] = React.useState({})

  const dbVideos = useAllVideos()

  const [createVideos, isUploading] = useCreateVideos()
  const [generateMissingTgps, isGeneratingTgps] = useGenerateMissingTgps()
  const [deleteMissingVideos, isDeletingVideos] = useDeleteMissingVideos()
  const deleteVideo = useDeleteVideo()

  const handleCreateVideos = async (e) => {
    await createVideos(Array.from(videoInputData).map((video) => video.path))
    setVideoInputData({})
  }

  if (dbVideos.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <VideosView
      filterText={filterText}
      setFilterText={setFilterText}
      dbVideos={dbVideos.data}
      handleDeleteVideo={deleteVideo}
      videoInputData={videoInputData}
      setVideoInputData={setVideoInputData}
      isUploading={isUploading}
      handleCreateVideos={handleCreateVideos}
      isGeneratingTgps={isGeneratingTgps}
      handleGenerateMissingTgps={generateMissingTgps}
      isDeletingVideos={isDeletingVideos}
      handleDeleteMissingVideos={deleteMissingVideos}
    />
  )
}
