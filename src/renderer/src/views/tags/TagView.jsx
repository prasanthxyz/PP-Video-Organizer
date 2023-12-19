import { Col, Row } from 'react-bootstrap'
import CheckBoxGroups from '../../components/CheckBoxGroups'

const TagView = ({ tag, allVideos, selectedVideos, setSelectedVideos, updateTagVideos }) => (
  <>
    <Row>
      <Col>
        <h3 className="display-6 text-center mt-2">{tag.title}</h3>
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
            await updateTagVideos([tag.title, videosDiffObj])
          }}
          useDiffObj={true}
        />
      </Col>
    </Row>
  </>
)

export default TagView
