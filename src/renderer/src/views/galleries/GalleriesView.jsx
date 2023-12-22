import * as React from 'react'
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
    <FilterForm setFilterText={setFilterText} />
    <Operations
      isCreating={isCreating}
      galleryInput={galleryInput}
      getGalleryPathInput={getGalleryPathInput}
      handleCreateGallery={handleCreateGallery}
      isDeletingGalleries={isDeletingGalleries}
      handleDeleteMissingGalleries={handleDeleteMissingGalleries}
    />
    {dbGalleries.length > 0 && (
      <GalleriesTable
        dbGalleries={dbGalleries}
        handleDeleteGallery={handleDeleteGallery}
        filterText={filterText}
      />
    )}
  </>
)

export default GalleriesView
