import { Stack, Tag } from 'rsuite'

const TagsList = ({ dbTags, filterText, navigate, handleDeleteTag }) => (
  <Stack spacing={10} wrap style={{ margin: '1.5rem', marginBottom: '2rem' }}>
    {dbTags.length > 0 ? (
      dbTags
        .filter((dbTag) => dbTag.title.toLowerCase().includes(filterText))
        .map((dbTag) => (
          <Tag
            key={dbTag.title}
            closable
            onClose={async () => await handleDeleteTag(dbTag.title)}
            size="lg"
          >
            <a
              style={{ height: '1.5rem', marginRight: '0.3rem' }}
              href={`#/tag/${encodeURIComponent(dbTag.title)}`}
            >
              {dbTag.title}
            </a>
          </Tag>
        ))
    ) : (
      <p>No tags found!</p>
    )}
  </Stack>
)

export default TagsList
