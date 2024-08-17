import * as React from 'react'
import { UseMutateFunction } from 'react-query'
import { Button, Form, Stack } from 'rsuite'
import SpinnerOr from '../common/SpinnerOr'

const Operations = ({
  isCreating,
  galleryInput,
  setGalleryInput,
  handleCreateGallery,
  isDeletingGalleries,
  handleDeleteMissingGalleries
}: {
  isCreating: boolean
  galleryInput: string
  setGalleryInput: React.Dispatch<React.SetStateAction<string>>
  handleCreateGallery: () => Promise<void>
  isDeletingGalleries: boolean
  handleDeleteMissingGalleries: UseMutateFunction<unknown, unknown, void, unknown>
}): JSX.Element => (
  <Stack spacing={20} alignItems="center" style={{ marginBottom: '0.3rem' }}>
    <SpinnerOr isSpinner={isCreating} msg="Creating...">
      <Stack spacing={5}>
        <Form.ControlLabel>Add new Gallery</Form.ControlLabel>
        <input value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} />
        {galleryInput && (
          <Button
            size="xs"
            appearance="primary"
            color="green"
            onClick={async () => await handleCreateGallery()}
          >
            Submit
          </Button>
        )}
      </Stack>
    </SpinnerOr>
    <SpinnerOr isSpinner={isDeletingGalleries} msg="Deleting...">
      <Button
        appearance="ghost"
        color="red"
        size="xs"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick={(_e: React.MouseEvent) => handleDeleteMissingGalleries()}
      >
        Delete Missing Galleries
      </Button>
    </SpinnerOr>
  </Stack>
)

export default Operations
