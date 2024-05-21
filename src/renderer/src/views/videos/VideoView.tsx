import { MutateOptions, UseMutateFunction } from 'react-query'
import { Button, Nav, Stack } from 'rsuite'
import { IDiffObj, IGallery, ITag, IVideoWithRelated } from '../../../../types'
import CheckBoxGroups from '../../components/CheckBoxGroups'
import VideoPlayer from '../../components/VideoPlayer'
import SpinnerOr from '../common/SpinnerOr'
import { NavigateFunction } from 'react-router-dom'

const VideoView = ({
  video,
  activeTab,
  isVideoPlaying,
  isVideoShown,
  toggleVideo,
  deleteVideo,
  isGeneratingTgp,
  handleGenerateTgp,
  updateVideoGalleries,
  updateVideoTags,
  allItems,
  selectedItems,
  setSelectedItems,
  handleTabClick,
  navigate
}: {
  video: IVideoWithRelated
  activeTab: string
  isVideoPlaying: boolean
  isVideoShown: boolean
  toggleVideo: () => void
  deleteVideo: UseMutateFunction<unknown, unknown, string, unknown>
  isGeneratingTgp: boolean
  handleGenerateTgp: UseMutateFunction<unknown, unknown, string, unknown>
  updateVideoGalleries: UseMutateFunction<unknown, unknown, [string, IDiffObj], unknown>
  updateVideoTags: UseMutateFunction<unknown, unknown, [string, IDiffObj], unknown>
  allItems: { tags: ITag[]; galleries: IGallery[] }
  selectedItems: { tags: Set<string>; galleries: Set<string> }
  setSelectedItems: {
    tags: React.Dispatch<React.SetStateAction<Set<string>>>
    galleries: React.Dispatch<React.SetStateAction<Set<string>>>
  }
  handleTabClick: (newTabId: string) => void
  navigate: NavigateFunction
}): JSX.Element => (
  <>
    <h5 style={{ textAlign: 'center' }}>{video.videoName}</h5>
    <Nav activeKey={activeTab} onSelect={handleTabClick} appearance="subtle" className="tabs-nav">
      <Nav.Item eventKey="galleries" className="tab-header">
        Galleries
      </Nav.Item>
      <Nav.Item eventKey="tags" className="tab-header">
        Tags
      </Nav.Item>
    </Nav>
    {activeTab === 'galleries' &&
      getTabContent(
        isVideoShown,
        isVideoPlaying,
        isGeneratingTgp,
        video,
        handleGenerateTgp,
        'Galleries',
        allItems.galleries.map((g: IGallery) => g.id),
        selectedItems.galleries,
        setSelectedItems.galleries,
        updateVideoGalleries,
        toggleVideo,
        deleteVideo,
        navigate
      )}
    {activeTab === 'tags' &&
      getTabContent(
        isVideoShown,
        isVideoPlaying,
        isGeneratingTgp,
        video,
        handleGenerateTgp,
        'Tags',
        allItems.tags.map((t: ITag) => t.id),
        selectedItems.tags,
        setSelectedItems.tags,
        updateVideoTags,
        toggleVideo,
        deleteVideo,
        navigate
      )}
  </>
)

const getTabContent = (
  isVideoShown: boolean,
  isVideoPlaying: boolean,
  isGeneratingTgp: boolean,
  video: IVideoWithRelated,
  handleGenerateTgp: UseMutateFunction<unknown, unknown, string, unknown>,
  heading: string,
  allItems: string[],
  selectedItems: Set<string>,
  setSelectedItems: React.Dispatch<React.SetStateAction<Set<string>>>,
  updateVideoItems: (
    variables: [string, IDiffObj],
    options?: MutateOptions<unknown, unknown, [string, IDiffObj], unknown> | undefined
  ) => void,
  toggleVideo: () => void,
  deleteVideo: UseMutateFunction<unknown, unknown, string, unknown>,
  navigate: NavigateFunction
): JSX.Element => {
  return (
    <Stack spacing={24} alignItems="flex-start" wrap={false}>
      <Stack.Item flex="3 1 0px">
        {getVideoElement(
          isVideoShown,
          isVideoPlaying,
          isGeneratingTgp,
          video,
          handleGenerateTgp,
          toggleVideo,
          deleteVideo,
          navigate
        )}
      </Stack.Item>
      <Stack.Item flex="1 1 0px">
        <CheckBoxGroups
          lists={[
            {
              heading: heading,
              allItems: allItems,
              selectedItems: selectedItems
            }
          ]}
          saveHandlers={[async (items): Promise<void> => setSelectedItems(items)]}
          postSave={async ([diffObj]) => {
            await updateVideoItems([video.id, diffObj as IDiffObj])
          }}
          useDiffObj={true}
        />
      </Stack.Item>
    </Stack>
  )
}

const getVideoElement = (
  isVideoShown: boolean,
  isVideoPlaying: boolean,
  isGeneratingTgp: boolean,
  video: IVideoWithRelated,
  handleGenerateTgp: UseMutateFunction<unknown, unknown, string, unknown>,
  toggleVideo: () => void,
  deleteVideo: UseMutateFunction<unknown, unknown, string, unknown>,
  navigate: NavigateFunction
): JSX.Element => {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        style={{ marginTop: '5px', marginBottom: '5px' }}
      >
        <Stack.Item>
          <div>
            PATH: <strong>{video.id}</strong>
          </div>
        </Stack.Item>
        <Stack.Item>
          <Button
            appearance="primary"
            size="xs"
            onClick={() => toggleVideo()}
            style={{ marginRight: '20px' }}
          >
            Toggle TGP/Video
          </Button>
          <Button
            appearance="primary"
            color="red"
            size="xs"
            onClick={async () => {
              await deleteVideo(video.id)
              navigate('/videos')
            }}
          >
            Delete
          </Button>
        </Stack.Item>
      </Stack>
      {isVideoShown ? (
        <>
          <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={`file:///${video.id}`} />
        </>
      ) : video.isTgpAvailable ? (
        <img width="100%" src={`file:///${video.tgpPath}`} />
      ) : (
        <SpinnerOr isSpinner={isGeneratingTgp} msg="Generating TGP...">
          <Button appearance="primary" onClick={async () => await handleGenerateTgp(video.id)}>
            Generate TGP
          </Button>
        </SpinnerOr>
      )}
    </>
  )
}

export default VideoView
