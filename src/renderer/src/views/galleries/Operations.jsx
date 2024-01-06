import * as React from 'react'
import { Button, Stack } from 'rsuite'
import SpinnerOr from '../common/SpinnerOr.jsx'

const Operations = ({
  isCreating,
  galleryInput,
  getGalleryPathInput,
  handleCreateGallery,
  isDeletingGalleries,
  handleDeleteMissingGalleries
}) => (
  <Stack justifyContent="space-around" alignItems="center">
    <SpinnerOr isSpinner={isCreating} msg="Creating...">
      <Stack spacing={10}>
        <Button appearance="primary" size="xs" onClick={async () => await getGalleryPathInput()}>
          Add new Gallery
        </Button>
        {!galleryInput && (
          <Button
            size="xs"
            appearance="primary"
            color="green"
            onClick={async () => await handleCreateGallery(galleryInput)}
          >
            Submit
          </Button>
        )}
      </Stack>
      <p>{galleryInput}</p>
    </SpinnerOr>
    <SpinnerOr isSpinner={isDeletingGalleries} msg="Deleting...">
      <Button appearance="ghost" color="red" size="xs" onClick={handleDeleteMissingGalleries}>
        Delete Missing Galleries
      </Button>
    </SpinnerOr>
  </Stack>
)

export default Operations
