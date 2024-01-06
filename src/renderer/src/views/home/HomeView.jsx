import * as React from 'react'
import { Nav } from 'rsuite'
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
  setIsVideoPlaying,
  handleTabClick
}) => (
  <>
    <Nav activeKey={activeTab} onSelect={handleTabClick} appearance="subtle" className="tabs-nav">
      <Nav.Item eventKey="watch" className="tab-header">
        Watch
      </Nav.Item>
      <Nav.Item eventKey="filter" className="tab-header">
        Config
      </Nav.Item>
    </Nav>
    {activeTab === 'watch' &&
      (combination === null ? (
        'No combination found!'
      ) : (
        <>
          <ControlBar
            showVid={showVid}
            setShowVid={setShowVid}
            videoPath={combination[0]}
            galleryPath={combination[1]}
            handleBack={handleBack}
            handleNext={handleNext}
          />
          <RPS combination={combination} showVid={showVid} isVideoPlaying={isVideoPlaying} />
        </>
      ))}
    {activeTab === 'filter' && (
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
    )}
  </>
)

export default HomeView
