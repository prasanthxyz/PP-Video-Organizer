import * as React from 'react'
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
    <div className="tabsheader">
      <div
        data-tab-id="watch"
        className={activeTab === 'watch' ? 'tabheader active' : 'tabheader'}
        onClick={handleTabClick}
      >
        Watch
      </div>
      <div
        data-tab-id="filter"
        className={activeTab === 'filter' ? 'tabheader active' : 'tabheader'}
        onClick={handleTabClick}
      >
        Config
      </div>
    </div>
    {activeTab === 'watch' && (
      <div>
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
        <div>
          {combination === null ? (
            'No combination found!'
          ) : (
            <RPS combination={combination} showVid={showVid} isVideoPlaying={isVideoPlaying} />
          )}
        </div>
      </div>
    )}
    {activeTab === 'filter' && (
      <div>
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
      </div>
    )}
  </>
)

export default HomeView
