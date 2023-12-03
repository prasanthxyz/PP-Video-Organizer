import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { Context } from '../App'
import CheckBoxGroups from '../components/CheckBoxGroups'

export default function Tag() {
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())

  const { allVideos, hasDataChanged, loadDataIfChanged } = React.useContext(Context)

  React.useEffect(() => {
    loadDataIfChanged()
  }, [hasDataChanged])

  let { tagTitle } = useParams()

  const loadData = async () => {
    setSelectedVideos(
      new Set((await mainAdapter.getDbTagData(tagTitle))['videos'].map((video) => video.filePath))
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
        await mainAdapter.updateDbTagVideos(tagTitle, videosDiffObj)
      }}
      useDiffObj={true}
    />
  )

  return (
    <>
      <Row>
        <Col>
          <h3 className="display-6 text-center mt-2">{tagTitle}</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>{relatedVideos}</Col>
      </Row>
    </>
  )
}
