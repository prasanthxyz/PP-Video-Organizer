import * as React from 'react'
import { Col, Table } from 'react-bootstrap'
import GalleryRow from '../../views/galleries/GalleryRow'

const GalleriesTable = ({ dbGalleries, handleDeleteGallery, filterText }) => (
  <Col xs={12} sm={6}>
    <Table>
      <thead>
        <tr>
          <th>Gallery</th>
          <th>Exists?</th>
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
    </Table>
  </Col>
)

export default GalleriesTable
