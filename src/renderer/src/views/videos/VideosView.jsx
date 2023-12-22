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
  <div>
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
    {dbVideos.length > 0 ? (
      <VideosTable
        dbVideos={dbVideos}
        handleDeleteVideo={handleDeleteVideo}
        filterText={filterText}
      />
    ) : (
      <p>No videos available.</p>
    )}
  </div>
)

export default VideosView
