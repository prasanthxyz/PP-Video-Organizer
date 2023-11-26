import * as React from 'react'
import { Button } from 'react-bootstrap'
import { Check2, X } from 'react-bootstrap-icons'
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
  const galleryHealth = galleryExists ? <Check2 /> : <X />
  const delGalleryButton = (
    <Button onClick={async () => await deleteGallery(galleryPath)}>Delete</Button>
  )

  return (
    <tr>
      <td>{galleryNameView}</td>
      <td>{galleryHealth}</td>
      <td>{delGalleryButton}</td>
    </tr>
  )
}
