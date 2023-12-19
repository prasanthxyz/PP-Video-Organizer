import * as React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import SpinnerOr from '../common/SpinnerOr.jsx'

const Operations = ({
  isCreating,
  galleryInput,
  getGalleryPathInput,
  handleCreateGallery,
  isDeletingGalleries,
  handleDeleteMissingGalleries
}) => (
  <>
    <Col xs={12} sm={6}>
      <Row>
        <Col>
          <SpinnerOr isSpinner={isCreating} msg="Creating...">
            <Button className="me-2" size="sm" onClick={async () => await getGalleryPathInput()}>
              Add new Gallery
            </Button>
            {galleryInput && (
              <Button
                variant="success"
                className="ms-2"
                size="sm"
                onClick={async () => await handleCreateGallery(galleryInput)}
              >
                Submit
              </Button>
            )}
          </SpinnerOr>
        </Col>
        <Col>
          <SpinnerOr isSpinner={isDeletingGalleries} msg="Deleting...">
            <Button
              className="ms-auto"
              variant="danger"
              size="sm"
              onClick={handleDeleteMissingGalleries}
            >
              Delete Missing Galleries
            </Button>
          </SpinnerOr>
        </Col>
      </Row>
      <Row>
        <div>{galleryInput}</div>
      </Row>
    </Col>
  </>
)

export default Operations
