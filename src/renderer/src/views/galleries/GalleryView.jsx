import * as React from 'react'
import CheckBoxGroups from '../../components/CheckBoxGroups.jsx'
import ImageSlideShow from '../../components/ImageSlideShow.jsx'

const GalleryView = ({
  gallery,
  allVideos,
  selectedVideos,
  setSelectedVideos,
  updateGalleryVideos
}) => (
  <>
    <div className="center-flex gallery-page-heading">
      <h4>{gallery.galleryPath}</h4>
    </div>
    <div className="gallery-page-content">
      {gallery.images.length > 0 ? (
        <ImageSlideShow galleryImages={gallery.images} />
      ) : (
        <div>No images found!</div>
      )}
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
    </div>
  </>
)

export default GalleryView
