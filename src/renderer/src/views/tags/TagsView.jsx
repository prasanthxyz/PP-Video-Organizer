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
    <FilterForm setFilterText={setFilterText} />
    {dbTags.length > 0 ? (
      <TagsList
        dbTags={dbTags}
        filterText={filterText}
        navigate={navigate}
        handleDeleteTag={handleDeleteTag}
      />
    ) : (
      <p>No tags found!</p>
    )}
    <AddTagForm
      setTagInput={setTagInput}
      isCreating={isCreating}
      handleCreateTags={handleCreateTags}
    />
  </>
)

export default TagsView
