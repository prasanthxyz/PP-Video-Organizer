import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'
import { Context } from '../App.jsx'
import { useAllGalleries } from '../hooks/galleries.js'
import GalleriesView from '../views/galleries/Galleries.jsx'

export default function Galleries() {
  const [filterText, setFilterText] = React.useState('')
  const [isCreating, setIsCreating] = React.useState(false)
  const [galleryInput, setGalleryInput] = React.useState('')
  const [isDeletingGalleries, setIsDeletingGalleries] = React.useState(false)

  const { setHasDataChanged } = React.useContext(Context)

  const dbGalleries = useAllGalleries().data || []

  const handleCreateGallery = async (e) => {
    setIsCreating(true)
    await mainAdapter.createDbGallery(galleryInput)
    setIsCreating(false)
    setHasDataChanged(true)
    setGalleryInput('')
    // await loadGalleries()
  }

  const handleDeleteGallery = async (galleryPathToRemove) => {
    await mainAdapter.deleteDbGallery(galleryPathToRemove)
    // setDbGalleries(dbGalleries.filter((dbGallery) => dbGallery.galleryPath !== galleryPathToRemove))
    setHasDataChanged(true)
  }

  const handleDeleteMissingGalleries = async () => {
    setIsDeletingGalleries(true)
    await mainAdapter.deleteMissingDbGalleries()
    // setDbGalleries([])
    // await loadGalleries()
    setIsDeletingGalleries(false)
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
      handleDeleteMissingGalleries={handleDeleteMissingGalleries}
      handleDeleteGallery={handleDeleteGallery}
      filterText={filterText}
    />
  )
}
