import * as React from 'react'
import { Row, Tab, Tabs } from 'react-bootstrap'
import CheckBoxGroups from '../../components/CheckBoxGroups'
import ControlBar from './ControlBar'
import SelectedCombination from './SelectedCombination'

function Home({
  activeTab,
  setIsVideoPlaying,
  setActiveTab,
  gs,
  allVideos,
  allTags,
  allGalleries,
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
          {gs.allCombinations.length !== 0 && (
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
          <SelectedCombination gs={gs} showVid={showVid} isVideoPlaying={isVideoPlaying} />
        </Row>
      </Tab>
      <Tab eventKey="filter" title="Config">
        <CheckBoxGroups
          lists={[
            {
              heading: 'Galleries',
              allItems: allGalleries,
              selectedItems: gs.selectedGalleries
            },
            {
              heading: 'Tags',
              allItems: allTags,
              selectedItems: gs.selectedTags
            },
            {
              heading: 'Videos',
              allItems: allVideos,
              selectedItems: gs.selectedVideos
            }
          ]}
          saveHandlers={[gs.setSelectedGalleries, gs.setSelectedTags, gs.setSelectedVideos]}
          postSave={async ([selectedGalleries, selectedTags, selectedVideos]) => {
            setShowVid(false)
            await gs.generateCombinations(selectedVideos, selectedTags, selectedGalleries)
          }}
        />
      </Tab>
    </Tabs>
  )
}

export default Home
