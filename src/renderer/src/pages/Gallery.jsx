import _ from 'lodash'
import * as React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import CheckBoxGroup from '../components/CheckBoxGroup'

export default function Gallery() {
  const [galleryImages, setGalleryImages] = React.useState([])
  const [allVideos, setAllVideos] = React.useState([])
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const [prevSelectedVideos, setPrevSelectedVideos] = React.useState(new Set())

  let { galleryPath } = useParams()

  const loadData = async () => {
    const imagePaths = await mainAdapter.getGalleryImagePaths(galleryPath)
    setGalleryImages(imagePaths.map((imagePath) => 'file:///' + imagePath.replace(/\\/g, '/')))

    setAllVideos((await mainAdapter.getDbVideos()).map((video) => video.filePath))
    const galleryData = await mainAdapter.getDbGalleryData(galleryPath)
    const selectedVideos = new Set(galleryData['videos'].map((video) => video.filePath))
    setSelectedVideos(selectedVideos)
    setPrevSelectedVideos(selectedVideos)
  }

  React.useEffect(() => {
    loadData()
  }, [])

  const galleryPathComponents = galleryPath.replace(/\\/g, '/').split('/')
  const galleryName = galleryPathComponents[galleryPathComponents.length - 1]
  const imgSlideShow = (
    <ImageGallery
      items={galleryImages.map((path) => ({ original: path }))}
      autoPlay={true}
      lazyLoad={true}
      showThumbnails={false}
      showFullscreenButton={false}
      disableKeyDown={true}
      slideInterval={2000}
      startIndex={_.random(galleryImages.length - 1)}
    />
  )

  const handleUpdateRelatedVideos = async () => {
    const updateVideosObj = { add: [], remove: [] }

    for (const video of selectedVideos) {
      if (!prevSelectedVideos.has(video)) {
        updateVideosObj['add'].push(video)
      }
    }

    for (const video of prevSelectedVideos) {
      if (!selectedVideos.has(video)) {
        updateVideosObj['remove'].push(video)
      }
    }

    await mainAdapter.updateDbGalleryVideos(galleryPath, updateVideosObj)
    setPrevSelectedVideos(selectedVideos)
  }

  const isSelectionChanged = !_.isEqual(prevSelectedVideos, selectedVideos)

  const relatedVideos = (
    <>
      <Row>
        <Col xs={12} className="d-flex align-items-center justify-content-between">
          <h6 className="fs-4">Associated Videos</h6>
          {isSelectionChanged && (
            <Button variant="success" size="sm" onClick={handleUpdateRelatedVideos}>
              Save
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <CheckBoxGroup
            allItems={allVideos}
            selectedItems={selectedVideos}
            update={setSelectedVideos}
          />
        </Col>
      </Row>
    </>
  )

  return (
    <>
      <Row>
        <h3 className="display-6 text-center">{galleryName}</h3>
      </Row>
      <Row className="d-flex">
        <Col xs={6}>{galleryImages.length > 0 && imgSlideShow}</Col>
        <Col xs={6}>{relatedVideos}</Col>
      </Row>
    </>
  )
}
