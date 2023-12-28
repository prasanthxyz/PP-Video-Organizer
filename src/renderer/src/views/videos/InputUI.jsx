import { Button, Flex, Input, Space } from 'antd'
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
  <Flex justify="space-between">
    <Space>
      <Button size="small">
        <label htmlFor="filesInput">Add new Video(s)</label>
      </Button>
      <Input
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
          <Button size="small" onClick={handleCreateVideos}>
            Submit {Array.from(videoInputData).length} file(s)
          </Button>
        )}
      </SpinnerOr>
    </Space>
    <Space>
      <SpinnerOr isSpinner={isGeneratingTgps} msg="Generating TGPs...">
        <Button size="small" onClick={handleGenerateMissingTgps}>
          Generate Missing TGPs
        </Button>
      </SpinnerOr>
      <SpinnerOr isSpinner={isDeletingVideos} msg="Deleting...">
        <Button size="small" onClick={handleDeleteMissingVideos}>
          Delete Missing Videos
        </Button>
      </SpinnerOr>
    </Space>
  </Flex>
)

export default InputUI
