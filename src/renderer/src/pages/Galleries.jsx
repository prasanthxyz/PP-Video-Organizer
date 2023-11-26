import * as React from 'react'
import { Button, Spinner, Stack, Table } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter.js'
import GalleryRow from '../components/GalleryRow.jsx'

export default function Galleries() {
  const [dbGalleries, setDbGalleries] = React.useState([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [galleryInput, setGalleryInput] = React.useState('')
  const [isDeletingGalleries, setIsDeletingGalleries] = React.useState(false)

  React.useEffect(() => {
    loadGalleries()
  }, [])

  const loadGalleries = async () => {
    setDbGalleries(await mainAdapter.getDbGalleries())
  }

  const handleCreateGallery = async (e) => {
    setIsCreating(true)
    await mainAdapter.createDbGallery(galleryInput)
    setIsCreating(false)
    setGalleryInput('')
    await loadGalleries()
  }

  const handleDeleteGallery = async (galleryPathToRemove) => {
    await mainAdapter.deleteDbGallery(galleryPathToRemove)
    setDbGalleries(dbGalleries.filter((dbGallery) => dbGallery.galleryPath !== galleryPathToRemove))
  }

  const handleDeleteMissingGalleries = async () => {
    setIsDeletingGalleries(true)
    await mainAdapter.deleteMissingDbGalleries()
    setDbGalleries([])
    await loadGalleries()
    setIsDeletingGalleries(false)
  }

  const getGalleryPathInput = async () => {
    setGalleryInput(await mainAdapter.chooseDirectory())
  }

  const galleriesTable = (
    <Table>
      <thead>
        <tr>
          <th>Gallery</th>
          <th>Exists?</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {dbGalleries.map((dbGallery) => (
          <GalleryRow
            key={dbGallery.galleryPath}
            galleryPath={dbGallery.galleryPath}
            deleteGallery={handleDeleteGallery}
          />
        ))}
      </tbody>
    </Table>
  )

  const addGalleryForm = (
    <div>
      {isCreating ? (
        <Spinner />
      ) : (
        <>
          <div>{galleryInput}</div>
          <Button onClick={async () => await getGalleryPathInput()}>Select Gallery</Button>
          {galleryInput !== '' && (
            <Button onClick={async () => await handleCreateGallery(galleryInput)}>Add</Button>
          )}
        </>
      )}
    </div>
  )

  return (
    <Stack direction="vertical">
      {isDeletingGalleries ? (
        <Spinner />
      ) : (
        <Button onClick={handleDeleteMissingGalleries}>Delete Missing Galleries</Button>
      )}
      {dbGalleries.length > 0 && galleriesTable}
      {addGalleryForm}
    </Stack>
  )
}
