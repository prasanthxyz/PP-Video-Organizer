import * as React from 'react'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import CheckBoxGroup from '../components/CheckBoxGroup'
import VideoPlayer from '../components/VideoPlayer'
import { Button, Spinner, Stack, Tab, Tabs } from 'react-bootstrap'

export default function Video() {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)
  const [allTags, setAllTags] = React.useState([])
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [currentSelectedTags, setCurrentSelectedTags] = React.useState(new Set())
  const [allGalleries, setAllGalleries] = React.useState([])
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())
  const [currentSelectedGalleries, setCurrentSelectedGalleries] = React.useState(new Set())

  let { videoPath } = useParams()
  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath))
    setAllTags((await mainAdapter.getDbTags()).map((tag) => tag.title))
    setAllGalleries((await mainAdapter.getDbGalleries()).map((gallery) => gallery.galleryPath))
    const videoData = await mainAdapter.getDbVideoData(videoPath)
    const selectedTags = new Set(videoData['tags'].map((tag) => tag.title))
    setSelectedTags(selectedTags)
    setCurrentSelectedTags(selectedTags)
    const selectedGalleries = new Set(videoData['galleries'].map((gallery) => gallery.galleryPath))
    setSelectedGalleries(selectedGalleries)
    setCurrentSelectedGalleries(selectedGalleries)
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

  const getUpdateObj = (prevItems, curItems) => {
    const updateObj = { add: [], remove: [] }

    for (const item of curItems) {
      if (!prevItems.has(item)) {
        updateObj['add'].push(item)
      }
    }

    for (const item of prevItems) {
      if (!curItems.has(item)) {
        updateObj['remove'].push(item)
      }
    }

    return updateObj
  }

  const handleUpdateRelated = async () => {
    const updateTagsObj = getUpdateObj(selectedTags, currentSelectedTags)
    await mainAdapter.updateDbVideoTags(videoPath, updateTagsObj)

    const updateGalleriesObj = getUpdateObj(selectedGalleries, currentSelectedGalleries)
    await mainAdapter.updateDbVideoGalleries(videoPath, updateGalleriesObj)
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
    <CheckBoxGroup
      allItems={allTags}
      selectedItems={selectedTags}
      update={setCurrentSelectedTags}
    />
  )

  const relatedGalleries = (
    <CheckBoxGroup
      allItems={allGalleries}
      selectedItems={selectedGalleries}
      update={setCurrentSelectedGalleries}
    />
  )

  const imgPath = getImgPath()
  return (
    <Stack direction="vertical">
      <h3>{videoName}</h3>
      <Tabs defaultActiveKey="tgp">
        <Tab eventKey="tgp" title="TGP">
          {tgpExists ? <img src={`file:///${imgPath}`} /> : <>TGP MISSING</>}
        </Tab>
        <Tab eventKey="video" title="Video">
          <VideoPlayer autoplay={false} controls={true} sources={videoPath} />
        </Tab>
      </Tabs>
      {tgpButton}
      <Stack direction="horizontal">
        {relatedTags}
        {relatedGalleries}
      </Stack>
      <Button onClick={handleUpdateRelated}>Save</Button>
    </Stack>
  )
}
