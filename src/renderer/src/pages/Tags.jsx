import * as React from 'react'
import { Badge, Button, Form, Row, Spinner } from 'react-bootstrap'
import { Plus, X } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter.js'

export default function Tags() {
  const [dbTags, setDbTags] = React.useState([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [tagInput, setTagInput] = React.useState('')

  const navigate = useNavigate()

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
          <Badge bg="dark" className="my-2 mx-2" key={dbTag.title}>
            <span className="mx-2" role="button" onClick={() => navigate(`/tag/${dbTag.title}`)}>
              {dbTag.title}
            </span>
            <X
              size={15}
              color="yellow"
              cursor={'pointer'}
              onClick={async () => await handleDeleteTag(dbTag.title)}
            />
          </Badge>
        ))}
      </div>
    </div>
  )

  const addTagForm = (
    <Form>
      <Form.Group className="d-flex my-3">
        <Form.Label className="col-3 d-flex align-items-center">
          Enter new tags (space separated)
        </Form.Label>
        <Form.Control className="me-3" type="text" id="tagInput" onChange={updateTagInput} />
        {isCreating ? (
          <Spinner />
        ) : (
          <Button className="d-flex align-items-center" onClick={handleCreateTags}>
            <Plus />
          </Button>
        )}
      </Form.Group>
    </Form>
  )

  return (
    <>
      <Row>{addTagForm}</Row>
      <Row>{dbTags.length > 0 && tagsTable}</Row>
    </>
  )
}
