import { Button, Nav } from 'rsuite'
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
    <h5 style={{ textAlign: 'center' }}>{video.videoName}</h5>
    <Nav activeKey={activeTab} onSelect={handleTabClick} appearance="subtle" className="tabs-nav">
      <Nav.Item eventKey="video" className="tab-header">
        Video
      </Nav.Item>
      <Nav.Item eventKey="tgp" className="tab-header">
        TGP
      </Nav.Item>
      <Nav.Item eventKey="relations" className="tab-header">
        Associations
      </Nav.Item>
    </Nav>
    {activeTab === 'video' && (
      <>
        <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={`file:///${video.id}`} />
        <p>Path: {video.id}</p>
      </>
    )}
    {activeTab === 'tgp' &&
      (video.isTgpAvailable ? (
        <img width="100%" src={`file:///${video.tgpPath}`} />
      ) : (
        <SpinnerOr isSpinner={isGeneratingTgp} msg="Generating TGP...">
          <Button appearance="primary" onClick={async () => await handleGenerateTgp(video.id)}>
            Generate TGP
          </Button>
        </SpinnerOr>
      ))}
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
