import SpinnerOr from '../common/SpinnerOr'

const InputUI = ({
  videoInputData,
  setVideoInputData,
  isUploading,
  handleCreateVideos,
  isGeneratingTgps,
  handleGenerateMissingTgps,
  isDeletingVideos,
  handleDeleteMissingVideos
}) => (
  <div className="videos-inputui d-flex">
    <div className="d-flex">
      <button disabled={Array.from(videoInputData).length !== 0}>
        <label htmlFor="filesInput">Add new Video(s)</label>
      </button>
      <input
        id="filesInput"
        type="file"
        style={{ visibility: 'hidden', width: '20px' }}
        multiple="multiple"
        onChange={(e) => {
          setVideoInputData(e.target.files)
        }}
      />
      <SpinnerOr isSpinner={isUploading} msg="Generating TGPs...">
        {Array.from(videoInputData).length !== 0 && (
          <button onClick={handleCreateVideos}>
            Submit {Array.from(videoInputData).length} file(s)
          </button>
        )}
      </SpinnerOr>
    </div>
    <div className="d-flex">
      <SpinnerOr isSpinner={isGeneratingTgps} msg="Generating TGPs...">
        <button onClick={handleGenerateMissingTgps}>Generate Missing TGPs</button>
      </SpinnerOr>
      <SpinnerOr isSpinner={isDeletingVideos} msg="Deleting...">
        <button onClick={handleDeleteMissingVideos}>Delete Missing Videos</button>
      </SpinnerOr>
    </div>
  </div>
)

export default InputUI
