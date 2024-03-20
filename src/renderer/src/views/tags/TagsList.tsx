import { UseMutateFunction } from 'react-query'
import { Stack, Tag } from 'rsuite'
import { ITag } from '../../../../types'

const TagsList = ({
  dbTags,
  filterText,
  handleDeleteTag
}: {
  dbTags: ITag[]
  filterText: string
  handleDeleteTag: UseMutateFunction<unknown, unknown, string, unknown>
}): JSX.Element => (
  <Stack spacing={10} wrap style={{ marginBottom: '2rem', marginTop: '0.2rem' }}>
    {dbTags.length > 0 ? (
      dbTags
        .filter((dbTag: ITag) => dbTag.title.toLowerCase().includes(filterText))
        .map((dbTag: ITag) => (
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
