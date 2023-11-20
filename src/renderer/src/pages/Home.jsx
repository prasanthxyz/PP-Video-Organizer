import { Button, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import _ from 'lodash'
import * as React from 'react'
import mainAdapter from '../../../mainAdapter'
import CheckBoxGroup from '../components/CheckBoxGroup'
import RPS from '../components/RPS'

export default function Home() {
  const [allCombinations, setAllCombinations] = React.useState([])
  const [combinationIndex, setCombinationIndex] = React.useState(0)
  const [allVideos, setAllVideos] = React.useState([])
  const [selectedVideos, setSelectedVideos] = React.useState([])
  const [allTags, setAllTags] = React.useState([])
  const [selectedTags, setSelectedTags] = React.useState([])
  const [allGalleries, setAllGalleries] = React.useState([])
  const [selectedGalleries, setSelectedGalleries] = React.useState([])

  const setData = async () => {
    setAllTags((await mainAdapter.getDbTags()).map((tag) => tag.title))
    setSelectedTags([])

    const allDbGalleries = (await mainAdapter.getDbGalleries()).map((g) => g.galleryPath)
    const isGalleryExisting = await Promise.all(allDbGalleries.map(mainAdapter.isDirExisting))
    const availableGalleries = allDbGalleries.filter((gallery, index) => isGalleryExisting[index])
    setAllGalleries(availableGalleries)
    setSelectedGalleries(availableGalleries)

    const allDbVideos = (await mainAdapter.getDbVideos()).map((dbVideo) => dbVideo.filePath)
    const isVideoExisting = await Promise.all(allDbVideos.map(mainAdapter.isFileExisting))
    const availableVideos = allDbVideos.filter((videoPath, index) => isVideoExisting[index])
    setAllVideos(availableVideos)
    setSelectedVideos(availableVideos)

    await generateCombinations(availableVideos, [], availableGalleries)
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

  const handleUpdateTags = (checkedItems) => {
    setSelectedTags(checkedItems)
  }

  const handleUpdateGalleries = async (checkedItems) => {
    setSelectedGalleries(checkedItems)
  }

  const handleUpdateVideos = async (checkedItems) => {
    setSelectedVideos(checkedItems)
  }

  const selection =
    allCombinations.length === 0 ? (
      <div>No combination found!</div>
    ) : (
      <RPS combination={allCombinations[combinationIndex]} />
    )
  const configuration = (
    <VStack>
      <HStack>
        <CheckBoxGroup
          allItems={allVideos}
          selectedItems={selectedVideos}
          save={null}
          update={handleUpdateVideos}
        />
        <CheckBoxGroup
          allItems={allTags}
          selectedItems={selectedTags}
          save={null}
          update={handleUpdateTags}
        />
        <CheckBoxGroup
          allItems={allGalleries}
          selectedItems={selectedGalleries}
          save={null}
          update={handleUpdateGalleries}
        />
      </HStack>
      <Button onClick={updateFilter}>UPDATE</Button>
    </VStack>
  )

  return (
    <Tabs>
      <TabList>
        <Tab>Watch</Tab>
        <Tab>Filter</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Button onClick={handleNext}>Next</Button>
          <div>{selection}</div>
        </TabPanel>
        <TabPanel>{configuration}</TabPanel>
      </TabPanels>
    </Tabs>
  )
}
