import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllTags, useCreateTags, useDeleteTag } from '../hooks/tags.js'
import TagsView from '../views/tags/Tags.jsx'

export default function Tags() {
  const [filterText, setFilterText] = React.useState('')
  const [tagInput, setTagInput] = React.useState('')

  const navigate = useNavigate()

  const dbTags = useAllTags().data || []

  const [createTags, isCreating] = useCreateTags()
  const deleteTag = useDeleteTag()

  const handleCreateTags = async (e) => {
    await createTags(tagInput)
    document.getElementById('tagInput').value = ''
  }

  return (
    <TagsView
      setFilterText={setFilterText}
      dbTags={dbTags}
      filterText={filterText}
      navigate={navigate}
      handleDeleteTag={deleteTag}
      setTagInput={setTagInput}
      isCreating={isCreating}
      handleCreateTags={handleCreateTags}
    />
  )
}
