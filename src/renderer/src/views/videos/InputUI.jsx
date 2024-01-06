import { Button, Stack } from 'rsuite'
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
  <Stack justifyContent="space-between" style={{ marginBottom: '0.3rem' }}>
    <Stack>
      <Button size="xs" appearance="primary">
        <label htmlFor="filesInput">Add new Video(s)</label>
      </Button>
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
          <Button size="xs" appearance="primary" color="green" onClick={handleCreateVideos}>
            Submit {Array.from(videoInputData).length} file(s)
          </Button>
        )}
      </SpinnerOr>
    </Stack>
    <Stack spacing={20}>
      <SpinnerOr isSpinner={isGeneratingTgps} msg="Generating TGPs...">
        <Button size="xs" appearance="ghost" onClick={handleGenerateMissingTgps}>
          Generate Missing TGPs
        </Button>
      </SpinnerOr>
      <SpinnerOr isSpinner={isDeletingVideos} msg="Deleting...">
        <Button size="xs" appearance="ghost" color="red" onClick={handleDeleteMissingVideos}>
          Delete Missing Videos
        </Button>
      </SpinnerOr>
    </Stack>
  </Stack>
)

export default InputUI
