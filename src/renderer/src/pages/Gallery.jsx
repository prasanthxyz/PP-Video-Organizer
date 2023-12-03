import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { Context } from '../App'
import CheckBoxGroups from '../components/CheckBoxGroups'
import ImageSlideShow from '../components/ImageSlideShow'

export default function Gallery() {
  const [galleryImages, setGalleryImages] = React.useState([])
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())

  const { allVideos, hasDataChanged, loadDataIfChanged } = React.useContext(Context)

  React.useEffect(() => {
    loadDataIfChanged()
  }, [hasDataChanged])

  let { galleryPath } = useParams()

  const loadData = async () => {
    setGalleryImages(
      (await mainAdapter.getGalleryImagePaths(galleryPath)).map(
        (imagePath) => 'file:///' + imagePath.replace(/\\/g, '/')
      )
    )
    setSelectedVideos(
      new Set(
        (await mainAdapter.getDbGalleryData(galleryPath))['videos'].map((video) => video.filePath)
      )
    )
  }

  React.useEffect(() => {
    loadData()
  }, [])

  const relatedVideos = (
    <CheckBoxGroups
      lists={[
        {
          heading: 'Videos',
          allItems: allVideos,
          selectedItems: selectedVideos
        }
      ]}
      saveHandlers={[setSelectedVideos]}
      postSave={async ([videosDiffObj]) => {
        await mainAdapter.updateDbGalleryVideos(galleryPath, videosDiffObj)
      }}
      useDiffObj={true}
    />
  )

  return (
    <>
      <Row>
        <Col>
          <h3 className="display-6 text-center">{galleryPath}</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          {galleryImages.length > 0 && <ImageSlideShow galleryImages={galleryImages} />}
        </Col>
        <Col xs={6}>{relatedVideos}</Col>
      </Row>
    </>
  )
}
