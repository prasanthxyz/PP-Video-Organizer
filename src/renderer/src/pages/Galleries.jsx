import * as React from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter.js'
import { Context } from '../App.jsx'
import FilterForm from '../components/FilterForm.jsx'
import GalleryRow from '../components/GalleryRow.jsx'
import SpinnerOr from '../components/SpinnerOr.jsx'

export default function Galleries() {
  const [dbGalleries, setDbGalleries] = React.useState([])
  const [filterText, setFilterText] = React.useState('')
  const [isCreating, setIsCreating] = React.useState(false)
  const [galleryInput, setGalleryInput] = React.useState('')
  const [isDeletingGalleries, setIsDeletingGalleries] = React.useState(false)

  const { setHasDataChanged } = React.useContext(Context)

  React.useEffect(() => {
    loadGalleries()
  }, [])

  const loadGalleries = async () => {
    setDbGalleries(await mainAdapter.getDbGalleries())
  }

  const handleCreateGallery = async (e) => {
    setIsCreating(true)
    await mainAdapter.createDbGallery(galleryInput)
    setIsCreating(false)
    setHasDataChanged(true)
    setGalleryInput('')
    await loadGalleries()
  }

  const handleDeleteGallery = async (galleryPathToRemove) => {
    await mainAdapter.deleteDbGallery(galleryPathToRemove)
    setDbGalleries(dbGalleries.filter((dbGallery) => dbGallery.galleryPath !== galleryPathToRemove))
    setHasDataChanged(true)
  }

  const handleDeleteMissingGalleries = async () => {
    setIsDeletingGalleries(true)
    await mainAdapter.deleteMissingDbGalleries()
    setDbGalleries([])
    await loadGalleries()
    setIsDeletingGalleries(false)
  }

  const getGalleryPathInput = async () => {
    setGalleryInput(await mainAdapter.chooseDirectory())
  }

  const operations = (
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

  const galleriesTable = (
    <Col xs={12} sm={6}>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Gallery</th>
            <th>Exists?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dbGalleries
            .map((dbGallery, index) => (
              <GalleryRow
                key={dbGallery.galleryPath}
                index={index}
                galleryPath={dbGallery.galleryPath}
                deleteGallery={handleDeleteGallery}
              />
            ))
            .filter((galleryRow) => galleryRow.key.toLowerCase().includes(filterText))}
        </tbody>
      </Table>
    </Col>
  )

  return (
    <>
      <Row className="mt-3">
        <Col xs={12} sm={6}>
          <FilterForm setFilterText={setFilterText} />
        </Col>
      </Row>
      <Row className="my-3">{operations}</Row>
      <Row>{dbGalleries.length > 0 && galleriesTable}</Row>
    </>
  )
}
