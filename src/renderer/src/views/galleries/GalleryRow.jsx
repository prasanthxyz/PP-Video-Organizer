import { FiCheck, FiX } from 'react-icons/fi'
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
    <td>{dbGallery.isAvailable ? <FiCheck /> : <FiX />}</td>
    <td>
      <button onClick={async () => await deleteGallery(dbGallery.galleryPath)}>Delete</button>
    </td>
  </tr>
)

export default GalleryRow
