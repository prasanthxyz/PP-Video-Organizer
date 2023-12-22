import * as React from 'react'
import GalleryRow from '../../views/galleries/GalleryRow'

const GalleriesTable = ({ dbGalleries, handleDeleteGallery, filterText }) => (
  <table className="galleries-table">
    <thead>
      <tr>
        <th>Gallery</th>
        <th>Available?</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {dbGalleries
        .filter((gallery) => gallery.galleryName.toLowerCase().includes(filterText))
        .map((dbGallery, index) => (
          <GalleryRow key={index} dbGallery={dbGallery} deleteGallery={handleDeleteGallery} />
        ))}
    </tbody>
  </table>
)

export default GalleriesTable
