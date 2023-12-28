import { Button, Image, Tabs, Typography } from 'antd'
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
    <Typography.Title level={4} style={{ textAlign: 'center' }}>
      {video.videoName}
    </Typography.Title>
    <Tabs
      size="small"
      activeKey={activeTab}
      items={[
        {
          key: 'video',
          label: 'Video',
          children: (
            <>
              <VideoPlayer
                autoplay={isVideoPlaying}
                controls={true}
                sources={`file:///${video.id}`}
              />
              <Typography.Text>Path: {video.id}</Typography.Text>
            </>
          )
        },
        {
          key: 'tgp',
          label: 'TGP',
          children: video.isTgpAvailable ? (
            <Image width="100%" src={`file:///${video.tgpPath}`} />
          ) : (
            <SpinnerOr isSpinner={isGeneratingTgp} msg="Generating TGP...">
              <Button size="small" onClick={async () => await handleGenerateTgp(video.id)}>
                Generate TGP
              </Button>
            </SpinnerOr>
          )
        },
        {
          key: 'relations',
          label: 'Associations',
          children: (
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
          )
        }
      ]}
      onChange={handleTabClick}
    />
  </>
)

export default VideoView
