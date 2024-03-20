import * as React from 'react'
import {
  useAllVideos,
  useCreateVideos,
  useDeleteMissingVideos,
  useDeleteVideo,
  useGenerateMissingTgps
} from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import FilterForm from '../views/common/FilterForm'
import InputUI from '../views/videos/InputUI'
import VideosTable from '../views/videos/VideosTable'

interface FileWithPath extends File {
  path: string
}

export default function Videos(): JSX.Element {
  const [filterText, setFilterText] = React.useState('')
  const [videoInputData, setVideoInputData] = React.useState<FileList>({} as FileList)

  const dbVideos = useAllVideos()

  const [createVideos, isUploading] = useCreateVideos()
  const [generateMissingTgps, isGeneratingTgps] = useGenerateMissingTgps()
  const [deleteMissingVideos, isDeletingVideos] = useDeleteMissingVideos()
  const deleteVideo = useDeleteVideo()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateVideos = async (_e: React.MouseEvent): Promise<void> => {
    await createVideos(
      Array.from(videoInputData as FileList).map((video: File) => (video as FileWithPath).path)
    )
    setVideoInputData({} as FileList)
  }

  if (dbVideos.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <>
      <InputUI
        videoInputData={videoInputData}
        setVideoInputData={setVideoInputData}
        isUploading={isUploading}
        handleCreateVideos={handleCreateVideos}
        isGeneratingTgps={isGeneratingTgps as boolean}
        handleGenerateMissingTgps={generateMissingTgps}
        isDeletingVideos={isDeletingVideos as boolean}
        handleDeleteMissingVideos={deleteMissingVideos}
      />
      <FilterForm setFilterText={setFilterText} />
      <VideosTable
        dbVideos={dbVideos.data ? dbVideos.data : []}
        handleDeleteVideo={deleteVideo}
        filterText={filterText}
      />
    </>
  )
}
