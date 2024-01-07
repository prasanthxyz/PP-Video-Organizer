import * as React from 'react'
import {
  useAllVideos,
  useCreateVideos,
  useDeleteMissingVideos,
  useDeleteVideo,
  useGenerateMissingTgps
} from '../hooks/videos.js'
import CenterMessage from '../views/app/CenterMessage.jsx'
import FilterForm from '../views/common/FilterForm.jsx'
import InputUI from '../views/videos/InputUI.jsx'
import VideosTable from '../views/videos/VideosTable.jsx'

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
    <>
      <InputUI
        videoInputData={videoInputData}
        setVideoInputData={setVideoInputData}
        isUploading={isUploading}
        handleCreateVideos={handleCreateVideos}
        isGeneratingTgps={isGeneratingTgps}
        handleGenerateMissingTgps={generateMissingTgps}
        isDeletingVideos={isDeletingVideos}
        handleDeleteMissingVideos={deleteMissingVideos}
      />
      <FilterForm setFilterText={setFilterText} />
      <VideosTable
        dbVideos={dbVideos.data}
        handleDeleteVideo={deleteVideo}
        filterText={filterText}
      />
    </>
  )
}
