import { Button, Input, Space } from 'antd'
import Typography from 'antd/es/typography/Typography'
import SpinnerOr from '../common/SpinnerOr'

const AddTagForm = ({ setTagInput, isCreating, handleCreateTags }) => (
  <>
    <Typography.Title level={4} style={{ marginTop: '2rem' }}>
      Enter new tags (space separated)
    </Typography.Title>
    <Space>
      <Input
        id="tagInput"
        onChange={(e) => {
          setTagInput(e.target.value)
        }}
        style={{ width: '15rem' }}
      />
      <SpinnerOr isSpinner={isCreating} msg="Creating...">
        <Button onClick={handleCreateTags}>Submit</Button>
      </SpinnerOr>
    </Space>
  </>
)

export default AddTagForm
