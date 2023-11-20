import {
  Button,
  HStack,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack
} from '@chakra-ui/react'
import * as React from 'react'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import CheckBoxGroup from '../components/CheckBoxGroup'
import VideoPlayer from '../components/VideoPlayer'

export default function Video() {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)
  const [allTags, setAllTags] = React.useState([])
  const [selectedTags, setSelectedTags] = React.useState([])
  const [allGalleries, setAllGalleries] = React.useState([])
  const [selectedGalleries, setSelectedGalleries] = React.useState([])

  let { videoPath } = useParams()
  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath))
    setAllTags((await mainAdapter.getDbTags()).map((tag) => tag.title))
    setAllGalleries((await mainAdapter.getDbGalleries()).map((gallery) => gallery.galleryPath))
    const videoData = await mainAdapter.getVideoData(videoPath)
    setSelectedTags(videoData['tags'].map((tag) => tag.title))
    setSelectedGalleries(videoData['galleries'].map((gallery) => gallery.galleryPath))
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

  const handleUpdateGalleries = async (checkedItems) => {
    await mainAdapter.updateVideoGalleries(videoPath, checkedItems)
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

  const relatedGalleries = (
    <CheckBoxGroup
      allItems={allGalleries}
      selectedItems={selectedGalleries}
      update={handleUpdateGalleries}
    />
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
      <HStack>
        {relatedTags}
        {relatedGalleries}
      </HStack>
    </VStack>
  )
}
