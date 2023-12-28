import FilterForm from '../common/FilterForm'
import InputUI from './InputUI'
import VideosTable from './VideosTable'

const VideosView = ({
  filterText,
  setFilterText,
  dbVideos,
  handleDeleteVideo,
  videoInputData,
  setVideoInputData,
  isUploading,
  handleCreateVideos,
  isGeneratingTgps,
  handleGenerateMissingTgps,
  isDeletingVideos,
  handleDeleteMissingVideos
}) => (
  <>
    <FilterForm setFilterText={setFilterText} />
    <InputUI
      videoInputData={videoInputData}
      setVideoInputData={setVideoInputData}
      isUploading={isUploading}
      handleCreateVideos={handleCreateVideos}
      isGeneratingTgps={isGeneratingTgps}
      handleGenerateMissingTgps={handleGenerateMissingTgps}
      isDeletingVideos={isDeletingVideos}
      handleDeleteMissingVideos={handleDeleteMissingVideos}
    />
    <VideosTable
      dbVideos={dbVideos}
      handleDeleteVideo={handleDeleteVideo}
      filterText={filterText}
    />
  </>
)

export default VideosView
