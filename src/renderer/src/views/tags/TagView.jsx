import CheckBoxGroups from '../../components/CheckBoxGroups'

const TagView = ({ tag, allVideos, selectedVideos, setSelectedVideos, updateTagVideos }) => (
  <>
    <h3 style={{ textAlign: 'center' }}>{tag.title}</h3>
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
