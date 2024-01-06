import { Button, Input, Stack } from 'rsuite'
import SpinnerOr from '../common/SpinnerOr'

const AddTagForm = ({ setTagInput, isCreating, handleCreateTags }) => (
  <div style={{ marginLeft: '1.5rem' }}>
    <h5 style={{ marginBottom: '0.2rem' }}>Enter new tags (space separated)</h5>
    <Stack spacing={10}>
      <Input
        id="tagInput"
        onChange={(value) => {
          setTagInput(value)
        }}
        style={{ width: '15rem' }}
      />
      <SpinnerOr isSpinner={isCreating} msg="Creating...">
        <Button appearance="primary" onClick={handleCreateTags}>
          Submit
        </Button>
      </SpinnerOr>
    </Stack>
  </div>
)

export default AddTagForm
