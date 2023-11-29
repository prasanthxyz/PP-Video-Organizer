import _ from 'lodash'
import * as React from 'react'
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap'
import { useHotkeys } from 'react-hotkeys-hook'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'
import RPS from '../components/RPS'
import RpsConfig from '../components/RpsConfig'

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
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  useHotkeys('c', () => {
    setIsVideoPlaying(false)
    setActiveTab('filter')
  })
  useHotkeys('w', () => {
    setIsVideoPlaying(false)
    setActiveTab('watch')
  })
  useHotkeys('p', () => {
    if (activeTab !== 'watch') return
    if (!showVid) {
      setShowVid(true)
      setIsVideoPlaying(true)
    } else {
      setIsVideoPlaying(false)
      setShowVid(false)
    }
  })

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
    setIsVideoPlaying(false)
    if (activeTab !== 'watch') setActiveTab('watch')
    const newIndex = combinationIndex === allCombinations.length - 1 ? 0 : combinationIndex + 1
    setCombinationIndex(newIndex)
    setShowVid(false)
  }

  useHotkeys('n', handleNext)

  const selection =
    allCombinations.length === 0 ? (
      <Row>
        <Col>No combination found!</Col>
      </Row>
    ) : (
      <RPS
        combination={allCombinations[combinationIndex]}
        showVid={showVid}
        isVideoPlaying={isVideoPlaying}
      />
    )

  const isSelectionChanged =
    !_.isEqual(selectedVideos, prevSelectedVideos) ||
    !_.isEqual(selectedGalleries, prevSelectedGalleries) ||
    !_.isEqual(selectedTags, prevSelectedTags)

  const videoPath = allCombinations.length > 0 ? allCombinations[combinationIndex][0] : ''
  const videoPathComponents = videoPath.replace(/\\/g, '/').split('/')
  const videoName = videoPathComponents[videoPathComponents.length - 1]
  const galleryPath = allCombinations.length > 0 ? allCombinations[combinationIndex][1] : ''
  const galleryPathComponents = galleryPath.replace(/\\/g, '/').split('/')
  const galleryName = galleryPathComponents[galleryPathComponents.length - 1]
  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => {
        setIsVideoPlaying(false)
        setActiveTab(tab)
      }}
    >
      <Tab eventKey="watch" title="Watch">
        <Row className="my-1">
          <Col xs={9} className="d-flex justify-content-between">
            <Button size="sm" variant="success" onClick={() => setShowVid(!showVid)}>
              {showVid ? 'Show TGP' : 'Show Video'}
            </Button>
            <Link to={`/video/${videoPath}`} className="fs-6">
              {videoName}
            </Link>
          </Col>
          <Col xs={3} className="d-flex justify-content-between">
            <Link to={`/gallery/${galleryPath}`} className="fs-6">
              {galleryName}
            </Link>
            <Button size="sm" onClick={handleNext}>
              Next
            </Button>
          </Col>
        </Row>
        {selection}
      </Tab>
      <Tab eventKey="filter" title="Config">
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
