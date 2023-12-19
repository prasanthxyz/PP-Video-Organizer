import { Row } from 'react-bootstrap'
import FilterForm from '../common/FilterForm'
import AddTagForm from './AddTagForm'
import TagsList from './TagsList'

const TagsView = ({
  filterText,
  setFilterText,
  dbTags,
  navigate,
  handleDeleteTag,
  setTagInput,
  isCreating,
  handleCreateTags
}) => (
  <>
    <Row className="mt-3">
      <FilterForm setFilterText={setFilterText} />
    </Row>
    <Row className="my-3">
      {dbTags.length > 0 && (
        <TagsList
          dbTags={dbTags}
          filterText={filterText}
          navigate={navigate}
          handleDeleteTag={handleDeleteTag}
        />
      )}
    </Row>
    <Row>
      <AddTagForm
        setTagInput={setTagInput}
        isCreating={isCreating}
        handleCreateTags={handleCreateTags}
      />
    </Row>
  </>
)

export default TagsView
