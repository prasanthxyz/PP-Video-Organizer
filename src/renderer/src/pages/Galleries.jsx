import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'
import {
  useAllGalleries,
  useCreateGallery,
  useDeleteGallery,
  useDeleteMissingGalleries
} from '../hooks/galleries.js'
import CenterMessage from '../views/app/CenterMessage.jsx'
import FilterForm from '../views/common/FilterForm.jsx'
import GalleriesTable from '../views/galleries/GalleriesTable.jsx'
import Operations from '../views/galleries/Operations.jsx'

export default function Galleries() {
  const [filterText, setFilterText] = React.useState('')
  const [galleryInput, setGalleryInput] = React.useState('')

  const dbGalleries = useAllGalleries()
  const [createGallery, isCreating] = useCreateGallery()
  const deleteGallery = useDeleteGallery()
  const [deleteMissingGalleries, isDeletingGalleries] = useDeleteMissingGalleries()

  const handleCreateGallery = async (e) => {
    await createGallery(galleryInput)
    setGalleryInput('')
  }

  const getGalleryPathInput = async () => {
    setGalleryInput(await mainAdapter.chooseDirectory())
  }

  if (dbGalleries.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <>
      <FilterForm setFilterText={setFilterText} />
      <Operations
        isCreating={isCreating}
        galleryInput={galleryInput}
        getGalleryPathInput={getGalleryPathInput}
        handleCreateGallery={handleCreateGallery}
        isDeletingGalleries={isDeletingGalleries}
        handleDeleteMissingGalleries={deleteMissingGalleries}
      />
      <GalleriesTable
        dbGalleries={dbGalleries.data}
        handleDeleteGallery={deleteGallery}
        filterText={filterText}
      />
    </>
  )
}
