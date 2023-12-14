import * as React from 'react'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'
import { getNameAndPathComponents } from '../utils'
import GalleryRowView from '../views/galleries/GalleryRow'

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

  return (
    <GalleryRowView
      index={index}
      galleryExists={galleryExists}
      getGalleryLink={getGalleryLink}
      galleryName={galleryName}
      deleteGallery={deleteGallery}
      galleryPath={galleryPath}
    />
  )
}
