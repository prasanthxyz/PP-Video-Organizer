import * as React from 'react'
import { Col, Table } from 'react-bootstrap'
import GalleryRow from '../../components/GalleryRow.jsx'

export default function GalleriesTable({ dbGalleries, handleDeleteGallery, filterText }) {
  return (
    <Col xs={12} sm={6}>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Gallery</th>
            <th>Exists?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dbGalleries
            .map((dbGallery, index) => (
              <GalleryRow
                key={dbGallery.galleryPath}
                index={index}
                galleryPath={dbGallery.galleryPath}
                deleteGallery={handleDeleteGallery}
              />
            ))
            .filter((galleryRow) => galleryRow.key.toLowerCase().includes(filterText))}
        </tbody>
      </Table>
    </Col>
  )
}
