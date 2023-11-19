import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Button, Td, Tr } from '@chakra-ui/react'
import * as React from 'react'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'

export default function GalleryRow({ galleryPath, deleteGallery }) {
  const [galleryExists, setGalleryExists] = React.useState(false)

  const setFilesExist = async () => {
    setGalleryExists(await mainAdapter.isDirExisting(galleryPath))
  }

  React.useEffect(() => {
    setFilesExist()
  }, [])

  const galleryPathComponents = galleryPath.replace(/\\/g, '/').split('/')
  const galleryName = galleryPathComponents[galleryPathComponents.length - 1]

  const galleryNameView = galleryExists ? (
    <Link to={`/gallery/${galleryPath}`}>{galleryName}</Link>
  ) : (
    <>{galleryName}</>
  )
  const galleryHealth = galleryExists ? <CheckIcon /> : <CloseIcon />
  const delGalleryButton = (
    <Button onClick={async () => await deleteGallery(galleryPath)}>Delete</Button>
  )

  return (
    <Tr>
      <Td>{galleryNameView}</Td>
      <Td>{galleryHealth}</Td>
      <Td>{delGalleryButton}</Td>
    </Tr>
  )
}
