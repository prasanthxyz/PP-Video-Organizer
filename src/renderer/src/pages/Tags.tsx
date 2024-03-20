import * as React from 'react'
import { useAllTags, useCreateTags, useDeleteTag } from '../hooks/tags'
import CenterMessage from '../views/app/CenterMessage'
import FilterForm from '../views/common/FilterForm'
import AddTagForm from '../views/tags/AddTagForm'
import TagsList from '../views/tags/TagsList'

export default function Tags(): JSX.Element {
  const [filterText, setFilterText] = React.useState('')
  const [tagInput, setTagInput] = React.useState('')

  const dbTags = useAllTags()
  const [createTags, isCreating] = useCreateTags()
  const deleteTag = useDeleteTag()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateTags = async (_e: React.MouseEvent): Promise<void> => {
    await createTags(tagInput)
    const tagInputElement = document.getElementById('tagInput') as HTMLInputElement
    if (tagInputElement) {
      tagInputElement.value = ''
    }
  }

  if (dbTags.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <>
      <AddTagForm
        setTagInput={setTagInput}
        isCreating={isCreating as boolean}
        handleCreateTags={handleCreateTags}
      />
      <FilterForm setFilterText={setFilterText} />
      <TagsList
        dbTags={dbTags.data ? dbTags.data : []}
        filterText={filterText}
        handleDeleteTag={deleteTag}
      />
    </>
  )
}
