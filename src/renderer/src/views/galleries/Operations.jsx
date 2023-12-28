import { Button, Flex, Space } from 'antd'
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
  <Flex justify="space-around" align="center">
    <div>
      <SpinnerOr isSpinner={isCreating} msg="Creating...">
        <Space>
          <Button size="small" onClick={async () => await getGalleryPathInput()}>
            Add new Gallery
          </Button>
          {galleryInput && (
            <Button size="small" onClick={async () => await handleCreateGallery(galleryInput)}>
              Submit
            </Button>
          )}
        </Space>
        <p>{galleryInput}</p>
      </SpinnerOr>
    </div>
    <div>
      <SpinnerOr isSpinner={isDeletingGalleries} msg="Deleting...">
        <Button size="small" onClick={handleDeleteMissingGalleries}>
          Delete Missing Galleries
        </Button>
      </SpinnerOr>
    </div>
  </Flex>
)

export default Operations
