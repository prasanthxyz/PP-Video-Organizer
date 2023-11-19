import {
  Button,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react'
import * as React from 'react'
import mainAdapter from '../../../mainAdapter.js'
import GalleryRow from '../components/GalleryRow.jsx'

export default function Galleries() {
  const [dbGalleries, setDbGalleries] = React.useState([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [galleryInput, setGalleryInput] = React.useState('')

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
    await mainAdapter.deleteGallery(galleryPathToRemove)
    setDbGalleries(dbGalleries.filter((dbGallery) => dbGallery.galleryPath !== galleryPathToRemove))
  }

  const getGalleryPathInput = async () => {
    setGalleryInput(await mainAdapter.chooseDirectory())
  }

  const galleriesTable = (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Gallery</Th>
            <Th>Exists?</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {dbGalleries.map((dbGallery) => (
            <GalleryRow
              key={dbGallery.galleryPath}
              galleryPath={dbGallery.galleryPath}
              deleteGallery={handleDeleteGallery}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
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
    <VStack>
      {dbGalleries.length > 0 && galleriesTable}
      {addGalleryForm}
    </VStack>
  )
}
