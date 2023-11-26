import * as React from 'react'
import { Button, Col, Row, Stack } from 'react-bootstrap'
import CheckBoxGroup from './CheckBoxGroup'
export default function RpsConfig(props) {
  return (
    <>
      <Row>
        <Col xs={4}>
          <h6 className="display-6 pb-3">Galleries</h6>
          <CheckBoxGroup
            allItems={props.allGalleries}
            selectedItems={props.selectedGalleries}
            update={props.setSelectedGalleries}
          />
        </Col>
        <Col xs={4}>
          <h6 className="display-6 pb-3">Tags</h6>
          <CheckBoxGroup
            allItems={props.allTags}
            selectedItems={props.selectedTags}
            update={props.setSelectedTags}
          />
        </Col>
        <Col xs={4}>
          <h6 className="display-6 pb-3">Videos</h6>
          <CheckBoxGroup
            allItems={props.allVideos}
            selectedItems={props.selectedVideos}
            update={props.setSelectedVideos}
          />
        </Col>
      </Row>
      <Row>{props.isSelectionChanged && <Button onClick={props.updateFilter}>UPDATE</Button>}</Row>
    </>
  )
}
