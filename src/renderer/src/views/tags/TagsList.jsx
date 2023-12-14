import { Badge } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'

function TagsList({ dbTags, filterText, navigate, handleDeleteTag }) {
  return (
    <div className="d-flex">
      <div className="flex-row">
        {dbTags
          .filter((dbTag) => dbTag.title.toLowerCase().includes(filterText))
          .map((dbTag) => (
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
}

export default TagsList
