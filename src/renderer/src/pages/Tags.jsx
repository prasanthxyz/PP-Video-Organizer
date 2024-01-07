import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllTags, useCreateTags, useDeleteTag } from '../hooks/tags.js'
import CenterMessage from '../views/app/CenterMessage.jsx'
import FilterForm from '../views/common/FilterForm.jsx'
import AddTagForm from '../views/tags/AddTagForm.jsx'
import TagsList from '../views/tags/TagsList.jsx'

export default function Tags() {
  const [filterText, setFilterText] = React.useState('')
  const [tagInput, setTagInput] = React.useState('')

  const dbTags = useAllTags()
  const [createTags, isCreating] = useCreateTags()
  const deleteTag = useDeleteTag()

  const navigate = useNavigate()

  const handleCreateTags = async (e) => {
    await createTags(tagInput)
    document.getElementById('tagInput').value = ''
  }

  if (dbTags.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <>
      <AddTagForm
        setTagInput={setTagInput}
        isCreating={isCreating}
        handleCreateTags={handleCreateTags}
      />
      <FilterForm setFilterText={setFilterText} />
      <TagsList
        dbTags={dbTags.data}
        filterText={filterText}
        navigate={navigate}
        handleDeleteTag={deleteTag}
      />
    </>
  )
}
