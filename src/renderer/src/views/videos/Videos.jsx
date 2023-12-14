import { Row } from 'react-bootstrap'
import FilterForm from '../common/FilterForm'
import InputUI from './InputUI'
import VideosTable from './VideosTable'

function Videos({
  setFilterText,
  dbVideos,
  handleDeleteVideo,
  filterText,
  setVideoInputData,
  videoInputData,
  isUploading,
  handleCreateVideos,
  isGeneratingTgps,
  handleGenerateMissingTgps,
  isDeletingVideos,
  handleDeleteMissingVideos
}) {
  return (
    <div>
      <Row className="mt-3">
        <FilterForm setFilterText={setFilterText} />
      </Row>
      <Row className="mt-3">
        <InputUI
          setVideoInputData={setVideoInputData}
          videoInputData={videoInputData}
          isUploading={isUploading}
          handleCreateVideos={handleCreateVideos}
          isGeneratingTgps={isGeneratingTgps}
          handleGenerateMissingTgps={handleGenerateMissingTgps}
          isDeletingVideos={isDeletingVideos}
          handleDeleteMissingVideos={handleDeleteMissingVideos}
        />
      </Row>
      <Row>
        {dbVideos.length > 0 && (
          <VideosTable
            dbVideos={dbVideos}
            handleDeleteVideo={handleDeleteVideo}
            filterText={filterText}
          />
        )}
      </Row>
    </div>
  )
}

export default Videos
