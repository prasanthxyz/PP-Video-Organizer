import { Button } from 'react-bootstrap'
import { Check2, X } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'

const GalleryRow = ({ dbGallery, deleteGallery }) => (
  <tr>
    <td>
      {dbGallery.isAvailable ? (
        <Link to={`/gallery/${encodeURIComponent(dbGallery.galleryPath)}`}>
          {dbGallery.galleryName}
        </Link>
      ) : (
        dbGallery.galleryName
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

export default GalleryRow
