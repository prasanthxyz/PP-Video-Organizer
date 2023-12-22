import SpinnerOr from '../common/SpinnerOr'

const AddTagForm = ({ setTagInput, isCreating, handleCreateTags }) => (
  <>
    <p className="mb-4">Enter new tags (space separated)</p>
    <div className="d-flex add-tags-form">
      <div>
        <input
          type="text"
          id="tagInput"
          onChange={(e) => {
            setTagInput(e.target.value)
          }}
        />
      </div>
      <div>
        <SpinnerOr isSpinner={isCreating} msg="Creating...">
          <button onClick={handleCreateTags}>Submit</button>
        </SpinnerOr>
      </div>
    </div>
  </>
)

export default AddTagForm
