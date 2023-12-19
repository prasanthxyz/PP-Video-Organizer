import * as React from 'react'
import { Context } from '../App.jsx'
import {
  useAllVideos,
  useCreateVideos,
  useDeleteMissingVideos,
  useDeleteVideo,
  useGenerateMissingTgps
} from '../hooks/videos.js'
import VideosView from '../views/videos/Videos.jsx'

export default function Videos() {
  const [filterText, setFilterText] = React.useState('')
  const [videoInputData, setVideoInputData] = React.useState({})

  const { setHasDataChanged } = React.useContext(Context)

  const dbVideos = useAllVideos()

  const [createVideos, isUploading] = useCreateVideos()
  const [generateMissingTgps, isGeneratingTgps] = useGenerateMissingTgps()
  const [deleteMissingVideos, isDeletingVideos] = useDeleteMissingVideos()
  const deleteVideo = useDeleteVideo()

  const handleCreateVideos = async (e) => {
    await createVideos(Array.from(videoInputData).map((video) => video.path))
    setHasDataChanged(true)
    setVideoInputData({})
  }

  return (
    <VideosView
      setFilterText={setFilterText}
      dbVideos={dbVideos.data || []}
      handleDeleteVideo={deleteVideo}
      filterText={filterText}
      setVideoInputData={setVideoInputData}
      videoInputData={videoInputData}
      isUploading={isUploading}
      handleCreateVideos={handleCreateVideos}
      isGeneratingTgps={isGeneratingTgps}
      handleGenerateMissingTgps={generateMissingTgps}
      isDeletingVideos={isDeletingVideos}
      handleDeleteMissingVideos={deleteMissingVideos}
    />
  )
}
