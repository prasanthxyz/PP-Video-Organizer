import _ from 'lodash'
import * as React from 'react'
import { Button, Stack, Tab, Tabs } from 'react-bootstrap'
import mainAdapter from '../../../mainAdapter'
import CheckBoxGroup from '../components/CheckBoxGroup'
import RPS from '../components/RPS'
import RpsConfig from '../components/RpsConfig'
import { useHotkeys } from 'react-hotkeys-hook'

export default function Home() {
  const [allCombinations, setAllCombinations] = React.useState([])
  const [combinationIndex, setCombinationIndex] = React.useState(0)
  const [allVideos, setAllVideos] = React.useState([])
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const [prevSelectedVideos, setPrevSelectedVideos] = React.useState(new Set())
  const [allTags, setAllTags] = React.useState([])
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [prevSelectedTags, setPrevSelectedTags] = React.useState(new Set())
  const [allGalleries, setAllGalleries] = React.useState([])
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())
  const [prevSelectedGalleries, setPrevSelectedGalleries] = React.useState(new Set())
  const [activeTab, setActiveTab] = React.useState('watch')
  const [showVid, setShowVid] = React.useState(false)

  useHotkeys('p', () => setShowVid(!showVid))
  useHotkeys('f', () => setActiveTab('filter'))

  const setData = async () => {
    setAllTags((await mainAdapter.getDbTags()).map((tag) => tag.title))
    setSelectedTags(new Set())
    setPrevSelectedTags(new Set())

    const allDbGalleries = (await mainAdapter.getDbGalleries()).map((g) => g.galleryPath)
    const isGalleryExisting = await Promise.all(allDbGalleries.map(mainAdapter.isDirExisting))
    const availableGalleries = allDbGalleries.filter((gallery, index) => isGalleryExisting[index])
    setAllGalleries(availableGalleries)
    setSelectedGalleries(new Set(availableGalleries))
    setPrevSelectedGalleries(new Set(availableGalleries))

    const allDbVideos = (await mainAdapter.getDbVideos()).map((dbVideo) => dbVideo.filePath)
    const isVideoExisting = await Promise.all(allDbVideos.map(mainAdapter.isFileExisting))
    const availableVideos = allDbVideos.filter((videoPath, index) => isVideoExisting[index])
    setAllVideos(availableVideos)
    setSelectedVideos(new Set(availableVideos))
    setPrevSelectedVideos(new Set(availableVideos))

    await generateCombinations(new Set(availableVideos), new Set(), new Set(availableGalleries))
  }

  const generateCombinations = async (videos, tags, galleries) => {
    const allCombinations = _.shuffle(
      await mainAdapter.getCombinationsData(videos, tags, galleries)
    )
    setAllCombinations(allCombinations)
    setCombinationIndex(0)
    setShowVid(false)
  }

  React.useEffect(() => {
    setData()
  }, [])

  const updateFilter = async () => {
    setPrevSelectedVideos(selectedVideos)
    setPrevSelectedTags(selectedTags)
    setPrevSelectedGalleries(selectedGalleries)
    await generateCombinations(selectedVideos, selectedTags, selectedGalleries)
  }

  const handleNext = () => {
    if (allCombinations.length === 0) return
    if (activeTab !== 'watch') setActiveTab('watch')
    const newIndex = combinationIndex === allCombinations.length - 1 ? 0 : combinationIndex + 1
    setCombinationIndex(newIndex)
    setShowVid(false)
  }

  useHotkeys('r', handleNext)

  const selection =
    allCombinations.length === 0 ? (
      <div>No combination found!</div>
    ) : (
      <RPS combination={allCombinations[combinationIndex]} showVid={showVid} />
    )

  const isSelectionChanged =
    !_.isEqual(selectedVideos, prevSelectedVideos) ||
    !_.isEqual(selectedGalleries, prevSelectedGalleries) ||
    !_.isEqual(selectedTags, prevSelectedTags)

  return (
    <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
      <Tab eventKey="watch" title="Watch">
        <Button onClick={handleNext}>Next</Button>
        <Button onClick={() => setShowVid(!showVid)}>{showVid ? 'Show TGP' : 'Show Video'}</Button>
        <div>{selection}</div>
      </Tab>
      <Tab eventKey="filter" title="Filter">
        <RpsConfig
          allGalleries={allGalleries}
          setSelectedGalleries={setSelectedGalleries}
          selectedGalleries={selectedGalleries}
          allTags={allTags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allVideos={allVideos}
          selectedVideos={selectedVideos}
          setSelectedVideos={setSelectedVideos}
          isSelectionChanged={isSelectionChanged}
          updateFilter={updateFilter}
        />
      </Tab>
    </Tabs>
  )
}
