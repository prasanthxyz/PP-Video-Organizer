import { Button } from 'react-bootstrap'
import { Check2, X } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'

function GalleryRow({ index, dbGallery, galleryName, deleteGallery }) {
  return (
    <tr>
      <td className="text-end col-1">{index + 1}</td>
      <td>
        {dbGallery.isAvailable ? (
          <Link to={`/gallery/${encodeURIComponent(dbGallery.galleryPath)}`}>{galleryName}</Link>
        ) : (
          galleryName
        )}
      </td>
      <td>{dbGallery.isAvailable ? <Check2 /> : <X />}</td>
      <td>
        <Button
          variant="danger"
          size="sm"
          onClick={async () => await deleteGallery(dbGallery.galleryPath)}
        >
          Delete
        </Button>
      </td>
    </tr>
  )
}

export default GalleryRow
