import _ from 'lodash'
import * as React from 'react'
import mainAdapter from '../../../mainAdapter'
import CheckBoxGroup from '../components/CheckBoxGroup'
import RPS from '../components/RPS'
import { Button, Stack, Tab, Tabs } from 'react-bootstrap'

export default function Home() {
  const [allCombinations, setAllCombinations] = React.useState([])
  const [combinationIndex, setCombinationIndex] = React.useState(0)
  const [allVideos, setAllVideos] = React.useState([])
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const [allTags, setAllTags] = React.useState([])
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [allGalleries, setAllGalleries] = React.useState([])
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())

  const setData = async () => {
    setAllTags((await mainAdapter.getDbTags()).map((tag) => tag.title))
    setSelectedTags(new Set())

    const allDbGalleries = (await mainAdapter.getDbGalleries()).map((g) => g.galleryPath)
    const isGalleryExisting = await Promise.all(allDbGalleries.map(mainAdapter.isDirExisting))
    const availableGalleries = allDbGalleries.filter((gallery, index) => isGalleryExisting[index])
    setAllGalleries(availableGalleries)
    setSelectedGalleries(new Set(availableGalleries))

    const allDbVideos = (await mainAdapter.getDbVideos()).map((dbVideo) => dbVideo.filePath)
    const isVideoExisting = await Promise.all(allDbVideos.map(mainAdapter.isFileExisting))
    const availableVideos = allDbVideos.filter((videoPath, index) => isVideoExisting[index])
    setAllVideos(availableVideos)
    setSelectedVideos(new Set(availableVideos))

    await generateCombinations(new Set(availableVideos), new Set(), new Set(availableGalleries))
  }

  const generateCombinations = async (videos, tags, galleries) => {
    const allCombinations = _.shuffle(
      await mainAdapter.getCombinationsData(videos, tags, galleries)
    )
    setAllCombinations(allCombinations)
    setCombinationIndex(0)
  }

  React.useEffect(() => {
    setData()
  }, [])

  const updateFilter = async () => {
    await generateCombinations(selectedVideos, selectedTags, selectedGalleries)
  }

  const handleNext = () => {
    const newIndex = combinationIndex === allCombinations.length - 1 ? 0 : combinationIndex + 1
    setCombinationIndex(newIndex)
  }

  const selection =
    allCombinations.length === 0 ? (
      <div>No combination found!</div>
    ) : (
      <RPS combination={allCombinations[combinationIndex]} />
    )

  const configuration = (
    <Stack direction="vertical">
      <Stack direction="horizontal">
        <CheckBoxGroup
          allItems={allVideos}
          selectedItems={selectedVideos}
          update={setSelectedVideos}
        />
        <CheckBoxGroup allItems={allTags} selectedItems={selectedTags} update={setSelectedTags} />
        <CheckBoxGroup
          allItems={allGalleries}
          selectedItems={selectedGalleries}
          update={setSelectedGalleries}
        />
      </Stack>
      <Button onClick={updateFilter}>UPDATE</Button>
    </Stack>
  )

  return (
    <Tabs defaultActiveKey="watch">
      <Tab eventKey="watch" title="Watch">
        <Button onClick={handleNext}>Next</Button>
        <div>{selection}</div>
      </Tab>
      <Tab eventKey="filter" title="Filter">
        {configuration}
      </Tab>
    </Tabs>
  )
}
