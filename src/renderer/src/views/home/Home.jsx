import * as React from 'react'
import { Row, Tab, Tabs } from 'react-bootstrap'
import CheckBoxGroups from '../../components/CheckBoxGroups'
import ControlBar from './ControlBar'
import SelectedCombination from './SelectedCombination'

function Home({
  activeTab,
  setIsVideoPlaying,
  setActiveTab,
  availableVideos,
  availableTags,
  availableGalleries,
  selection,
  saveSelection,
  combinations,
  combinationIndex,
  showVid,
  setShowVid,
  videoPath,
  galleryPath,
  handleBack,
  handleNext,
  isVideoPlaying
}) {
  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => {
        setIsVideoPlaying(false)
        setActiveTab(tab)
      }}
    >
      <Tab eventKey="watch" title="Watch">
        <Row className="my-1">
          {combinations.length !== 0 && (
            <ControlBar
              showVid={showVid}
              setShowVid={setShowVid}
              videoPath={videoPath}
              galleryPath={galleryPath}
              handleBack={handleBack}
              handleNext={handleNext}
            />
          )}
        </Row>
        <Row>
          <SelectedCombination
            combinations={combinations}
            combinationIndex={combinationIndex}
            showVid={showVid}
            isVideoPlaying={isVideoPlaying}
          />
        </Row>
      </Tab>
      <Tab eventKey="filter" title="Config">
        <CheckBoxGroups
          lists={[
            {
              heading: 'Galleries',
              allItems: availableGalleries,
              selectedItems: selection.galleries
            },
            {
              heading: 'Tags',
              allItems: availableTags,
              selectedItems: selection.tags
            },
            {
              heading: 'Videos',
              allItems: availableVideos,
              selectedItems: selection.videos
            }
          ]}
          saveHandlers={[() => {}, () => {}, () => {}]}
          postSave={async ([galleries, tags, videos]) => {
            setShowVid(false)
            await saveSelection(videos, tags, galleries)
          }}
        />
      </Tab>
    </Tabs>
  )
}

export default Home
