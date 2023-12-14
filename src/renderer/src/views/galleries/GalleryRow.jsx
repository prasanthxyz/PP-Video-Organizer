import { Button } from 'react-bootstrap'
import { Check2, X } from 'react-bootstrap-icons'

function GalleryRow({
  index,
  galleryExists,
  getGalleryLink,
  galleryName,
  deleteGallery,
  galleryPath
}) {
  return (
    <tr>
      <td className="text-end col-1">{index + 1}</td>
      <td>{galleryExists ? getGalleryLink() : galleryName}</td>
      <td>{galleryExists ? <Check2 /> : <X />}</td>
      <td>
        <Button variant="danger" size="sm" onClick={async () => await deleteGallery(galleryPath)}>
          Delete
        </Button>
      </td>
    </tr>
  )
}

export default GalleryRow
