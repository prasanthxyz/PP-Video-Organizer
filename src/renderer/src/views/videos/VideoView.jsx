import CheckBoxGroups from '../../components/CheckBoxGroups'
import VideoPlayer from '../../components/VideoPlayer'
import SpinnerOr from '../common/SpinnerOr'

const VideoView = ({
  video,
  activeTab,
  isVideoPlaying,
  isGeneratingTgp,
  handleGenerateTgp,
  updateVideoRelations,
  allItems,
  selectedItems,
  setSelectedItems,
  handleTabClick
}) => (
  <>
    <div className="center-flex video-page-heading">
      <h4>{video.videoName}</h4>
    </div>
    <div className="tabsheader">
      <div
        data-tab-id="video"
        className={activeTab === 'video' ? 'tabheader active' : 'tabheader'}
        onClick={handleTabClick}
      >
        Video
      </div>
      <div
        data-tab-id="tgp"
        className={activeTab === 'tgp' ? 'tabheader active' : 'tabheader'}
        onClick={handleTabClick}
      >
        TGP
      </div>
      <div
        data-tab-id="relations"
        className={activeTab === 'relations' ? 'tabheader active' : 'tabheader'}
        onClick={handleTabClick}
      >
        Associations
      </div>
    </div>
    {activeTab === 'video' && (
      <div className="video-page-player-container">
        <div className="video-page-player">
          <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={`file:///${video.id}`} />
        </div>
        <p>{video.id}</p>
      </div>
    )}
    {activeTab === 'tgp' && (
      <div className="video-page-tgp-container">
        {video.isTgpAvailable ? (
          <img className="mh-100 mw-100" src={`file:///${video.tgpPath}`} />
        ) : (
          <SpinnerOr isSpinner={isGeneratingTgp} msg="Generating TGP...">
            <button onClick={async () => await handleGenerateTgp(video.id)}>Generate TGP</button>
          </SpinnerOr>
        )}
      </div>
    )}
    {activeTab === 'relations' && (
      <CheckBoxGroups
        lists={[
          {
            heading: 'Tags',
            allItems: allItems.tags.map((t) => t.id),
            selectedItems: selectedItems.tags
          },
          {
            heading: 'Galleries',
            allItems: allItems.galleries.map((g) => g.id),
            selectedItems: selectedItems.galleries
          }
        ]}
        saveHandlers={[setSelectedItems.tags, setSelectedItems.galleries]}
        postSave={async ([tagsDiffObj, galleriesDiffObj]) => {
          await updateVideoRelations([video.id, tagsDiffObj, galleriesDiffObj])
        }}
        useDiffObj={true}
      />
    )}
  </>
)

export default VideoView
