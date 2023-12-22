import { FiX } from 'react-icons/fi'

const TagsList = ({ dbTags, filterText, navigate, handleDeleteTag }) => (
  <div className="d-flex tag-badge-container">
    {dbTags
      .filter((dbTag) => dbTag.title.toLowerCase().includes(filterText))
      .map((dbTag) => (
        <div className="tag-badge" key={dbTag.title}>
          <p
            className="mx-2"
            role="button"
            onClick={() => navigate(`/tag/${encodeURIComponent(dbTag.title)}`)}
          >
            {dbTag.title}
          </p>
          <FiX
            color="orange"
            cursor={'pointer'}
            onClick={async () => await handleDeleteTag(dbTag.title)}
          />
        </div>
      ))}
  </div>
)

export default TagsList
