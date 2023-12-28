import { CloseOutlined } from '@ant-design/icons'
import { Space, Tag } from 'antd'

const TagsList = ({ dbTags, filterText, navigate, handleDeleteTag }) => (
  <>
    <Space size="middle" wrap>
      {dbTags
        .filter((dbTag) => dbTag.title.toLowerCase().includes(filterText))
        .map((dbTag) => (
          <Tag
            key={dbTag.title}
            closable
            onClose={async () => await handleDeleteTag(dbTag.title)}
            color="#777"
            style={{
              height: '2.5rem',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center'
            }}
            closeIcon={
              <CloseOutlined style={{ fontSize: '1rem', color: 'orange', marginTop: '0.3rem' }} />
            }
          >
            <a
              style={{ height: '1.5rem', marginRight: '0.3rem' }}
              href={`#/tag/${encodeURIComponent(dbTag.title)}`}
            >
              {dbTag.title}
            </a>
          </Tag>
        ))}
    </Space>
  </>
)

export default TagsList
