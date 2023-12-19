import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'
import {
  useAllGalleries,
  useCreateGallery,
  useDeleteGallery,
  useDeleteMissingGalleries
} from '../hooks/galleries.js'
import GalleriesView from '../views/galleries/Galleries.jsx'

export default function Galleries() {
  const [filterText, setFilterText] = React.useState('')
  const [galleryInput, setGalleryInput] = React.useState('')

  const dbGalleries = useAllGalleries().data || []

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

  return (
    <GalleriesView
      setFilterText={setFilterText}
      dbGalleries={dbGalleries}
      isCreating={isCreating}
      galleryInput={galleryInput}
      getGalleryPathInput={getGalleryPathInput}
      handleCreateGallery={handleCreateGallery}
      isDeletingGalleries={isDeletingGalleries}
      handleDeleteMissingGalleries={deleteMissingGalleries}
      handleDeleteGallery={deleteGallery}
      filterText={filterText}
    />
  )
}
