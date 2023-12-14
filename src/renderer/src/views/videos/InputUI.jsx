import { Button, Col } from 'react-bootstrap'
import SpinnerOr from '../common/SpinnerOr'

function InputUI({
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
    <>
      <Col xs={6} className="d-flex">
        <label className="btn btn-primary btn-sm" htmlFor="filesInput">
          Add new Video(s)
        </label>
        <input
          id="filesInput"
          type="file"
          style={{ visibility: 'hidden', width: '20px' }}
          multiple="multiple"
          onChange={(e) => {
            setVideoInputData(e.target.files)
          }}
        />
        {Array.from(videoInputData).length !== 0 && (
          <SpinnerOr isSpinner={isUploading} msg="Generating TGPs...">
            <Button size="sm" variant="success" onClick={handleCreateVideos}>
              Submit {Array.from(videoInputData).length} file(s)
            </Button>
          </SpinnerOr>
        )}
      </Col>
      <Col xs={6} className="d-flex justify-content-end">
        <SpinnerOr isSpinner={isGeneratingTgps} msg="Generating TGPs...">
          <Button className="me-3" size="sm" onClick={handleGenerateMissingTgps}>
            Generate Missing TGPs
          </Button>
        </SpinnerOr>
        <SpinnerOr isSpinner={isDeletingVideos} msg="Deleting...">
          <Button size="sm" variant="danger" onClick={handleDeleteMissingVideos}>
            Delete Missing Videos
          </Button>
        </SpinnerOr>
      </Col>
    </>
  )
}

export default InputUI
