import { Button, Input, Stack } from 'rsuite'
import SpinnerOr from '../common/SpinnerOr'

const AddTagForm = ({ setTagInput, isCreating, handleCreateTags }) => (
  <Stack spacing={10} style={{ marginBottom: '0.8rem' }}>
    <h6>Enter new tags (space separated)</h6>
    <Input
      id="tagInput"
      size="xs"
      onChange={(value) => {
        setTagInput(value)
      }}
      style={{ width: '15rem' }}
    />
    <SpinnerOr isSpinner={isCreating} msg="Creating...">
      <Button size="xs" appearance="primary" onClick={handleCreateTags}>
        Submit
      </Button>
    </SpinnerOr>
  </Stack>
)

export default AddTagForm
