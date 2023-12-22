import * as React from 'react'
import SpinnerOr from '../common/SpinnerOr.jsx'

const Operations = ({
  isCreating,
  galleryInput,
  getGalleryPathInput,
  handleCreateGallery,
  isDeletingGalleries,
  handleDeleteMissingGalleries
}) => (
  <div className="gallery-operations-container d-flex space-between">
    <div>
      <SpinnerOr isSpinner={isCreating} msg="Creating...">
        <button onClick={async () => await getGalleryPathInput()}>Add new Gallery</button>
        {galleryInput && (
          <button onClick={async () => await handleCreateGallery(galleryInput)}>Submit</button>
        )}
        <p className="gallery-input-content">{galleryInput}</p>
      </SpinnerOr>
    </div>
    <div>
      <SpinnerOr isSpinner={isDeletingGalleries} msg="Deleting...">
        <button onClick={handleDeleteMissingGalleries}>Delete Missing Galleries</button>
      </SpinnerOr>
    </div>
  </div>
)

export default Operations
