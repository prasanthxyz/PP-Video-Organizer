import { Button, Stack } from 'rsuite';
import SpinnerOr from '../common/SpinnerOr';
import { UseMutateFunction } from 'react-query';

const InputUI = ({
  videoInputData,
  setVideoInputData,
  isUploading,
  handleCreateVideos,
  isGeneratingTgps,
  handleGenerateMissingTgps,
  isDeletingVideos,
  handleDeleteMissingVideos,
}: {
  videoInputData: FileList;
  setVideoInputData: React.Dispatch<React.SetStateAction<FileList>>;
  isUploading: boolean;
  handleCreateVideos: (_e: React.MouseEvent) => Promise<void>;
  isGeneratingTgps: boolean;
  handleGenerateMissingTgps: UseMutateFunction<unknown, unknown, void, unknown>;
  isDeletingVideos: boolean;
  handleDeleteMissingVideos: UseMutateFunction<unknown, unknown, void, unknown>;
}) => (
  <Stack justifyContent="space-between" style={{ marginBottom: '0.3rem' }}>
    <Stack>
      <Button size="xs" appearance="primary">
        <label htmlFor="filesInput">Add new Video(s)</label>
      </Button>
      <input
        id="filesInput"
        type="file"
        style={{ visibility: 'hidden', width: '0.3rem' }}
        multiple={true}
        onChange={(e) => {
          setVideoInputData(e.target.files ? e.target.files : ({} as FileList));
        }}
      />
      <SpinnerOr isSpinner={isUploading} msg="Generating TGPs...">
        {Array.from(videoInputData).length !== 0 && (
          <Button
            size="xs"
            appearance="primary"
            color="green"
            onClick={handleCreateVideos}
          >
            Submit {Array.from(videoInputData).length} file(s)
          </Button>
        )}
      </SpinnerOr>
    </Stack>
    <Stack spacing={5}>
      <SpinnerOr isSpinner={isGeneratingTgps} msg="Generating TGPs...">
        <Button
          size="xs"
          appearance="ghost"
          onClick={(_e: React.MouseEvent) => handleGenerateMissingTgps()}
        >
          Generate Missing TGPs
        </Button>
      </SpinnerOr>
      <SpinnerOr isSpinner={isDeletingVideos} msg="Deleting...">
        <Button
          size="xs"
          appearance="ghost"
          color="red"
          onClick={(_e: React.MouseEvent) => handleDeleteMissingVideos()}
        >
          Delete Missing Videos
        </Button>
      </SpinnerOr>
    </Stack>
  </Stack>
);

export default InputUI;
