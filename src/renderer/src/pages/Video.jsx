import { Button, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import * as React from 'react'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import VideoPlayer from '../components/VideoPlayer'
import CheckBoxGroup from '../components/CheckBoxGroup'

export default function Video() {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)
  const [allTags, setAllTags] = React.useState([])
  const [selectedTags, setSelectedTags] = React.useState([])

  let { videoPath } = useParams()
  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath))
    setAllTags((await mainAdapter.getDbTags()).map((tag) => tag.title))
    setSelectedTags((await mainAdapter.getVideoData(videoPath))['tags'].map((tag) => tag.title))
  }
  React.useEffect(() => {
    setFilesExist()
  }, [])

  const handleGenerateTgp = async (regenerate = false) => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(videoPath, regenerate)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const handleUpdateTags = async (checkedItems) => {
    await mainAdapter.updateVideoTags(videoPath, checkedItems)
  }

  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')
  const videoName = videoPathComponents[videoPathComponents.length - 1]
  const getImgPath = () => {
    const imgPathComponents = videoPathComponents.slice(0, videoPathComponents.length - 1)
    imgPathComponents.push('img')
    imgPathComponents.push(videoPathComponents[videoPathComponents.length - 1] + '.jpg')
    return imgPathComponents.join('/')
  }

  const tgpButton = isGeneratingTgp ? (
    <Spinner />
  ) : (
    <Button onClick={async () => await handleGenerateTgp(tgpExists)}>
      {tgpExists ? 'Regenerate' : 'Generate'} TGP
    </Button>
  )

  const relatedTags = (
    <CheckBoxGroup allItems={allTags} selectedItems={selectedTags} update={handleUpdateTags} />
  )

  const imgPath = getImgPath()
  return (
    <VStack>
      <h3>{videoName}</h3>
      <Tabs>
        <TabList>
          <Tab>TGP</Tab>
          <Tab>Video</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{tgpExists ? <img src={`file:///${imgPath}`} /> : <>TGP MISSING</>}</TabPanel>
          <TabPanel>
            <VideoPlayer autoplay={false} controls={true} sources={videoPath} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {tgpButton}
      {relatedTags}
    </VStack>
  )
}
