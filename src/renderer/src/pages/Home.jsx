import _ from 'lodash'
import * as React from 'react'
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap'
import { useHotkeys } from 'react-hotkeys-hook'
import { Link } from 'react-router-dom'
import { Context } from '../App'
import RPS from '../components/RPS'
import RpsConfig from '../components/RpsConfig'

export default function Home() {
  const [activeTab, setActiveTab] = React.useState('watch')
  const [showVid, setShowVid] = React.useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)
  const [prevSelectedVideos, setPrevSelectedVideos] = React.useState(new Set())
  const [prevSelectedTags, setPrevSelectedTags] = React.useState(new Set())
  const [prevSelectedGalleries, setPrevSelectedGalleries] = React.useState(new Set())

  const {
    allCombinations,
    setAllCombinations,
    combinationIndex,
    setCombinationIndex,
    allVideos,
    setAllVideos,
    selectedVideos,
    setSelectedVideos,
    allTags,
    setAllTags,
    selectedTags,
    setSelectedTags,
    allGalleries,
    setAllGalleries,
    selectedGalleries,
    setSelectedGalleries,
    generateCombinations
  } = React.useContext(Context)

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
    setPrevSelectedTags(new Set())
    setPrevSelectedGalleries(new Set(allGalleries))
    setPrevSelectedVideos(new Set(allVideos))
  }

  React.useEffect(() => {
    setData()
  }, [])

  const updateFilter = async () => {
    setPrevSelectedVideos(selectedVideos)
    setPrevSelectedTags(selectedTags)
    setPrevSelectedGalleries(selectedGalleries)
    setShowVid(false)
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
