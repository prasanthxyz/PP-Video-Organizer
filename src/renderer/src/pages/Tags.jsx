import * as React from 'react'
import { Badge, Button, Form, Spinner, Stack } from 'react-bootstrap'
import { Plus, X } from 'react-bootstrap-icons'
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
    <div className="d-flex">
      <div className="flex-row">
        {dbTags.map((dbTag) => (
          <Badge bg="info" className="my-2 mx-2" key={dbTag.title}>
            <span className="mx-3">{dbTag.title}</span>
            <Badge pill bg="danger" onClick={async () => await handleDeleteTag(dbTag.title)}>
              <X />
            </Badge>
          </Badge>
        ))}
      </div>
    </div>
  )

  const addTagForm = (
    <Form>
      <Form.Group className="d-flex">
        <Form.Label>Enter new tags (space separated)</Form.Label>
        <Form.Control className="mx-3" type="text" id="tagInput" onChange={updateTagInput} />
        {isCreating ? (
          <Spinner />
        ) : (
          <Button onClick={handleCreateTags}>
            <Plus />
          </Button>
        )}
      </Form.Group>
    </Form>
  )

  return (
    <Stack direction="vertical">
      {dbTags.length > 0 && tagsTable}
      {addTagForm}
    </Stack>
  )
}
