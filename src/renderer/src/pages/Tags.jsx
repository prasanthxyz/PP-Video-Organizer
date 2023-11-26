import * as React from 'react'
import { Button, FormLabel, Spinner, Stack, Table } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter.js'

export default function Tags() {
  const [dbTags, setDbTags] = React.useState([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [tagInput, setTagInput] = React.useState('')

  React.useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    setDbTags(await mainAdapter.getDbTags())
  }

  const updateTagInput = (e) => {
    setTagInput(e.target.value)
  }

  const handleCreateTags = async (e) => {
    setIsCreating(true)
    await mainAdapter.createDbTags(tagInput)
    setIsCreating(false)
    document.getElementById('tagInput').value = ''
    await loadTags()
  }

  const handleDeleteTag = async (tagTitleToRemove) => {
    await mainAdapter.deleteDbTag(tagTitleToRemove)
    setDbTags(dbTags.filter((dbTag) => dbTag.title !== tagTitleToRemove))
  }

  const tagsTable = (
    <Table>
      <thead>
        <tr>
          <th>Tag</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {dbTags.map((dbTag) => (
          <tr key={dbTag.title}>
            <td>{dbTag.title}</td>
            <td>
              <Button onClick={async () => await handleDeleteTag(dbTag.title)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )

  const addTagForm = (
    <div>
      <FormLabel>Enter new tags (space separated)</FormLabel>
      <input id="tagInput" onChange={updateTagInput} />
      {isCreating ? <Spinner /> : <Button onClick={handleCreateTags}>Add</Button>}
    </div>
  )

  return (
    <Stack direction="vertical">
      {dbTags.length > 0 && tagsTable}
      {addTagForm}
    </Stack>
  )
}
