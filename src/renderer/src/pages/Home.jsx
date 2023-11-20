import { Button, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
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
    const allDbGalleries = (await mainAdapter.getDbGalleries()).map(
      (gallery) => gallery.galleryPath
    )
    setAllGalleries(allDbGalleries)
    setSelectedGalleries(allDbGalleries)
    const allDbVideos = (await mainAdapter.getDbVideos()).map((dbVideo) => dbVideo.filePath)
    setAllVideos(allDbVideos)
    setSelectedVideos(allDbVideos)
    await generateCombinations(allDbVideos, [], allDbGalleries)
  }

  const generateCombinations = async (videos, tags, galleries) => {
    const allCombinations = await mainAdapter.getCombinationsData(videos, tags, galleries)
    setAllCombinations(allCombinations)
    setCombinationIndex(0)
  }

  React.useEffect(() => {
    setData()
  }, [])

  const updateFilter = async () => {
    const allCombinations = await mainAdapter.getCombinationsData(
      selectedVideos,
      selectedTags,
      selectedGalleries
    )
    setAllCombinations(allCombinations)
    setCombinationIndex(0)
  }

  const handleNext = () => {
    const newIndex = combinationIndex === allCombinations.length - 1 ? 0 : combinationIndex + 1
    setCombinationIndex(newIndex)
  }

  const handleUpdateTags = (checkedItems) => {
    setSelectedTags(checkedItems['data'])
  }

  const handleUpdateGalleries = async (checkedItems) => {
    setSelectedGalleries(checkedItems['data'])
  }

  const handleUpdateVideos = async (checkedItems) => {
    setSelectedVideos(checkedItems['data'])
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
          update={handleUpdateVideos}
        />
        <CheckBoxGroup allItems={allTags} selectedItems={selectedTags} update={handleUpdateTags} />
        <CheckBoxGroup
          allItems={allGalleries}
          selectedItems={selectedGalleries}
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
