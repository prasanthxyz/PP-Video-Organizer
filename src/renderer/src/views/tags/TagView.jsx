import { Typography } from 'antd'
import CheckBoxGroups from '../../components/CheckBoxGroups'

const TagView = ({ tag, allVideos, selectedVideos, setSelectedVideos, updateTagVideos }) => (
  <>
    <Typography.Title level={2} style={{ textAlign: 'center' }}>
      {tag.title}
    </Typography.Title>
    <CheckBoxGroups
      lists={[
        {
          heading: 'Videos',
          allItems: allVideos.map((v) => v.id),
          selectedItems: selectedVideos
        }
      ]}
      saveHandlers={[setSelectedVideos]}
      postSave={async ([videosDiffObj]) => {
        await updateTagVideos([tag.title, videosDiffObj])
      }}
      useDiffObj={true}
    />
  </>
)

export default TagView
