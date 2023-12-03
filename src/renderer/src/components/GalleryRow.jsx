import * as React from 'react'
import { Button } from 'react-bootstrap'
import { Check2, X } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'
import { getNameAndPathComponents } from '../utils'

export default function GalleryRow({ index, galleryPath, deleteGallery }) {
  const [galleryExists, setGalleryExists] = React.useState(false)

  const setFilesExist = async () => {
    setGalleryExists(await mainAdapter.isDirExisting(galleryPath))
  }

  React.useEffect(() => {
    setFilesExist()
  }, [])

  const galleryName = getNameAndPathComponents(galleryPath)[0]

  const getGalleryLink = () => <Link to={`/gallery/${galleryPath}`}>{galleryName}</Link>

  const delGalleryButton = (
    <Button variant="danger" size="sm" onClick={async () => await deleteGallery(galleryPath)}>
      Delete
    </Button>
  )

  return (
    <tr>
      <td className="text-end col-1">{index + 1}</td>
      <td>{galleryExists ? getGalleryLink() : galleryName}</td>
      <td>{galleryExists ? <Check2 /> : <X />}</td>
      <td>{delGalleryButton}</td>
    </tr>
  )
}
