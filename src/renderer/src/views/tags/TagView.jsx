import CheckBoxGroups from '../../components/CheckBoxGroups'

const TagView = ({ tag, allVideos, selectedVideos, setSelectedVideos, updateTagVideos }) => (
  <>
    <div className="center-flex tag-page-heading">
      <h4>{tag.title}</h4>
    </div>
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
