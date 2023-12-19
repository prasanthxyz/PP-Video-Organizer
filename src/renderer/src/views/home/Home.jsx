import * as React from 'react'
import { Row, Tab, Tabs } from 'react-bootstrap'
import CheckBoxGroups from '../../components/CheckBoxGroups'
import ControlBar from './ControlBar'
import SelectedCombination from './SelectedCombination'

function Home({
  activeTab,
  setIsVideoPlaying,
  setActiveTab,
  selectedVideos,
  setSelectedVideos,
  selectedTags,
  setSelectedTags,
  selectedGalleries,
  setSelectedGalleries,
  combinations,
  combinationIndex,
  setHasDataChanged,
  availableVideos,
  availableTags,
  availableGalleries,
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
              selectedItems: selectedGalleries
            },
            {
              heading: 'Tags',
              allItems: availableTags,
              selectedItems: selectedTags
            },
            {
              heading: 'Videos',
              allItems: availableVideos,
              selectedItems: selectedVideos
            }
          ]}
          saveHandlers={[setSelectedGalleries, setSelectedTags, setSelectedVideos]}
          postSave={async ([selectedGalleries, selectedTags, selectedVideos]) => {
            setShowVid(false)
            setHasDataChanged(true)
          }}
        />
      </Tab>
    </Tabs>
  )
}

export default Home
