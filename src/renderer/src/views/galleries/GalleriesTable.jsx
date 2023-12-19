import * as React from 'react'
import { Col, Table } from 'react-bootstrap'
import { getNameAndPathComponents } from '../../utils.js'
import GalleryRowView from '../../views/galleries/GalleryRow'

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
              <GalleryRowView
                key={dbGallery.galleryPath}
                index={index}
                dbGallery={dbGallery}
                galleryName={getNameAndPathComponents(dbGallery.galleryPath)[0]}
                deleteGallery={handleDeleteGallery}
              />
            ))
            .filter((galleryRow) => galleryRow.key.toLowerCase().includes(filterText))}
        </tbody>
      </Table>
    </Col>
  )
}
