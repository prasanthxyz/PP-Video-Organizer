import * as React from 'react'
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import CheckBoxGroups from '../../components/CheckBoxGroups'
import ControlBar from '../../components/ControlBar'
import RPS from '../../components/RPS'

const HomeView = ({
  activeTab,
  setActiveTab,
  availableItems,
  selection,
  saveSelection,
  combination,
  showVid,
  setShowVid,
  handleBack,
  handleNext,
  isVideoPlaying,
  setIsVideoPlaying
}) => (
  <Tabs
    activeKey={activeTab}
    onSelect={(tab) => {
      setIsVideoPlaying(false)
      setActiveTab(tab)
    }}
  >
    <Tab eventKey="watch" title="Watch">
      <Row className="my-1">
        {combination !== null && (
          <ControlBar
            showVid={showVid}
            setShowVid={setShowVid}
            videoPath={combination[0]}
            galleryPath={combination[1]}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        )}
      </Row>
      <Row>
        <Col>
          {combination === null ? (
            'No combination found!'
          ) : (
            <RPS combination={combination} showVid={showVid} isVideoPlaying={isVideoPlaying} />
          )}
        </Col>
      </Row>
    </Tab>
    <Tab eventKey="filter" title="Config">
      <CheckBoxGroups
        lists={[
          {
            heading: 'Galleries',
            allItems: availableItems.galleries,
            selectedItems: selection.galleries
          },
          {
            heading: 'Tags',
            allItems: availableItems.tags,
            selectedItems: selection.tags
          },
          {
            heading: 'Videos',
            allItems: availableItems.videos,
            selectedItems: selection.videos
          }
        ]}
        saveHandlers={[() => {}, () => {}, () => {}]}
        postSave={async ([galleries, tags, videos]) => {
          setShowVid(false)
          setIsVideoPlaying(false)
          await saveSelection(videos, tags, galleries)
        }}
      />
    </Tab>
  </Tabs>
)

export default HomeView
