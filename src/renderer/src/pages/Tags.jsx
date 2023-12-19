import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter.js'
import { Context } from '../App.jsx'
import TagsView from '../views/tags/Tags.jsx'
import { useAllTags } from '../hooks/tags.js'

export default function Tags() {
  const [filterText, setFilterText] = React.useState('')
  const [isCreating, setIsCreating] = React.useState(false)
  const [tagInput, setTagInput] = React.useState('')

  const { setHasDataChanged } = React.useContext(Context)

  const navigate = useNavigate()

  const dbTags = useAllTags().data || []

  const handleCreateTags = async (e) => {
    setIsCreating(true)
    await mainAdapter.createDbTags(tagInput)
    setIsCreating(false)
    document.getElementById('tagInput').value = ''
    setHasDataChanged(true)
  }

  const handleDeleteTag = async (tagTitleToRemove) => {
    await mainAdapter.deleteDbTag(tagTitleToRemove)
    setHasDataChanged(true)
  }

  return (
    <TagsView
      setFilterText={setFilterText}
      dbTags={dbTags}
      filterText={filterText}
      navigate={navigate}
      handleDeleteTag={handleDeleteTag}
      setTagInput={setTagInput}
      isCreating={isCreating}
      handleCreateTags={handleCreateTags}
    />
  )
}
