import mainAdapter from '../../../../mainAdapter'
import CheckBoxGroups from '../../components/CheckBoxGroups'

export default function RelatedVideos({
  allVideos,
  selectedVideos,
  setSelectedVideos,
  galleryPath
}) {
  return (
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
        await mainAdapter.updateDbGalleryVideos(galleryPath, videosDiffObj)
      }}
      useDiffObj={true}
    />
  )
}
