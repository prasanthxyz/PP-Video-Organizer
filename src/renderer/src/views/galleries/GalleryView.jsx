import * as React from 'react'
import { Stack } from 'rsuite'
import CheckBoxGroups from '../../components/CheckBoxGroups.jsx'
import ImageSlideShowView from '../common/ImageSlideShowView.jsx'

const GalleryView = ({
  gallery,
  allVideos,
  selectedVideos,
  setSelectedVideos,
  updateGalleryVideos
}) => (
  <>
    <h5 style={{ textAlign: 'center' }}>{gallery.galleryPath}</h5>
    <Stack alignItems="flex-start" wrap={false}>
      <Stack.Item flex="3 1 0px" style={{ width: 0 }}>
        {gallery.images.length > 0 ? (
          <ImageSlideShowView galleryImages={gallery.images} />
        ) : (
          <div>No images found!</div>
        )}
      </Stack.Item>
      <Stack.Item flex="5 1 0px" style={{ width: 0 }}>
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
            await updateGalleryVideos([gallery.galleryPath, videosDiffObj])
          }}
          useDiffObj={true}
        />
      </Stack.Item>
    </Stack>
  </>
)

export default GalleryView
