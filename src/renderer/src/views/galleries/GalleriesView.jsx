import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import FilterForm from '../common/FilterForm.jsx'
import GalleriesTable from './GalleriesTable.jsx'
import Operations from './Operations.jsx'

const GalleriesView = ({
  filterText,
  setFilterText,
  dbGalleries,
  galleryInput,
  getGalleryPathInput,
  isCreating,
  handleCreateGallery,
  isDeletingGalleries,
  handleDeleteMissingGalleries,
  handleDeleteGallery
}) => (
  <>
    <Row className="mt-3">
      <Col xs={12} sm={6}>
        <FilterForm setFilterText={setFilterText} />
      </Col>
    </Row>
    <Row className="my-3">
      <Operations
        isCreating={isCreating}
        galleryInput={galleryInput}
        getGalleryPathInput={getGalleryPathInput}
        handleCreateGallery={handleCreateGallery}
        isDeletingGalleries={isDeletingGalleries}
        handleDeleteMissingGalleries={handleDeleteMissingGalleries}
      />
    </Row>
    <Row>
      {dbGalleries.length > 0 && (
        <GalleriesTable
          dbGalleries={dbGalleries}
          handleDeleteGallery={handleDeleteGallery}
          filterText={filterText}
        />
      )}
    </Row>
  </>
)

export default GalleriesView