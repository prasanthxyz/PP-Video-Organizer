import CheckBoxGroups from '../../components/CheckBoxGroups'

export default function RelatedVideos({
  allVideos,
  selectedVideos,
  setSelectedVideos,
  galleryPath,
  updateGalleryVideos
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
        await updateGalleryVideos([galleryPath, videosDiffObj])
      }}
      useDiffObj={true}
    />
  )
}
