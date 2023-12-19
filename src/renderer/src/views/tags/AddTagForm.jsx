import { Button, Form } from 'react-bootstrap'
import SpinnerOr from '../common/SpinnerOr'

const AddTagForm = ({ setTagInput, isCreating, handleCreateTags }) => (
  <Form>
    <Form.Group className="d-flex my-3">
      <Form.Label className="col-3 d-flex align-items-center">
        Enter new tags (space separated)
      </Form.Label>
      <Form.Control
        className="me-3"
        type="text"
        id="tagInput"
        onChange={(e) => {
          setTagInput(e.target.value)
        }}
      />
      <SpinnerOr isSpinner={isCreating} msg="Creating...">
        <Button size="sm" variant="success" onClick={handleCreateTags}>
          Submit
        </Button>
      </SpinnerOr>
    </Form.Group>
  </Form>
)

export default AddTagForm
