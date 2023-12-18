import { Col, Row } from 'react-bootstrap'
import mainAdapter from '../../../../mainAdapter'
import CheckBoxGroups from '../../components/CheckBoxGroups'

function Tag({ tagTitle, allVideos, selectedVideos, setSelectedVideos }) {
  return (
    <>
      <Row>
        <Col>
          <h3 className="display-6 text-center mt-2">{tagTitle}</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <CheckBoxGroups
            lists={[
              {
                heading: 'Videos',
                allItems: allVideos.map((v) => v.id),
                selectedItems: selectedVideos
              }
            ]}
            saveHandlers={[setSelectedVideos]}
            postSave={async ([videosDiffObj]) => {
              await mainAdapter.updateDbTagVideos(tagTitle, videosDiffObj)
            }}
            useDiffObj={true}
          />
        </Col>
      </Row>
    </>
  )
}

export default Tag
