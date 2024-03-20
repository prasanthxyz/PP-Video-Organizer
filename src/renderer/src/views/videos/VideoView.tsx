import { UseMutateFunction } from 'react-query'
import { Button, Nav } from 'rsuite'
import { IDiffObj, IGallery, ITag, IVideoWithRelated } from '../../../../types'
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
}: {
  video: IVideoWithRelated
  activeTab: string
  isVideoPlaying: boolean
  isGeneratingTgp: boolean
  handleGenerateTgp: UseMutateFunction<unknown, unknown, string, unknown>
  updateVideoRelations: UseMutateFunction<string, unknown, [string, IDiffObj, IDiffObj], unknown>
  allItems: { tags: ITag[]; galleries: IGallery[] }
  selectedItems: { tags: Set<string>; galleries: Set<string> }
  setSelectedItems: {
    tags: React.Dispatch<React.SetStateAction<Set<string>>>
    galleries: React.Dispatch<React.SetStateAction<Set<string>>>
  }
  handleTabClick: (newTabId: string) => void
}): JSX.Element => (
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
            allItems: allItems.tags.map((t: ITag) => t.id),
            selectedItems: selectedItems.tags
          },
          {
            heading: 'Galleries',
            allItems: allItems.galleries.map((g: IGallery) => g.id),
            selectedItems: selectedItems.galleries
          }
        ]}
        saveHandlers={[
          async (ts): Promise<void> => setSelectedItems.tags(ts),
          async (gs): Promise<void> => setSelectedItems.galleries(gs)
        ]}
        postSave={async ([tagsDiffObj, galleriesDiffObj]) => {
          await updateVideoRelations([
            video.id,
            tagsDiffObj as IDiffObj,
            galleriesDiffObj as IDiffObj
          ])
        }}
        useDiffObj={true}
      />
    )}
  </>
)

export default VideoView
