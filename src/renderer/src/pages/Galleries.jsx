import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'
import {
  useAllGalleries,
  useCreateGallery,
  useDeleteGallery,
  useDeleteMissingGalleries
} from '../hooks/galleries.js'
import CenterMessage from '../views/app/CenterMessage.jsx'
import GalleriesView from '../views/galleries/GalleriesView.jsx'

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
    <GalleriesView
      filterText={filterText}
      setFilterText={setFilterText}
      dbGalleries={dbGalleries.data}
      galleryInput={galleryInput}
      getGalleryPathInput={getGalleryPathInput}
      isCreating={isCreating}
      handleCreateGallery={handleCreateGallery}
      isDeletingGalleries={isDeletingGalleries}
      handleDeleteMissingGalleries={deleteMissingGalleries}
      handleDeleteGallery={deleteGallery}
    />
  )
}
