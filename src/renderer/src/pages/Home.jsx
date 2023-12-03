import * as React from 'react'
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap'
import { useHotkeys } from 'react-hotkeys-hook'
import { Link } from 'react-router-dom'
import { Context } from '../App'
import CheckBoxGroups from '../components/CheckBoxGroups'
import RPS from '../components/RPS'

export default function Home() {
  const [activeTab, setActiveTab] = React.useState('watch')
  const [showVid, setShowVid] = React.useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  const {
    allCombinations,
    combinationIndex,
    setCombinationIndex,
    allVideos,
    selectedVideos,
    setSelectedVideos,
    allTags,
    selectedTags,
    setSelectedTags,
    allGalleries,
    selectedGalleries,
    setSelectedGalleries,
    generateCombinations,
    hasDataChanged,
    loadDataIfChanged
  } = React.useContext(Context)

  React.useEffect(() => {
    loadDataIfChanged()
  }, [hasDataChanged])

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

  const navigateCombinations = (next = true) => {
    if (activeTab !== 'watch') setActiveTab('watch')
    if (allCombinations.length === 0) return
    setIsVideoPlaying(false)
    let newIndex = combinationIndex + (next ? 1 : -1)
    if (newIndex < 0) newIndex += allCombinations.length
    setCombinationIndex(newIndex % allCombinations.length)
    setShowVid(false)
  }
  const handleNext = () => navigateCombinations(true)
  const handleBack = () => navigateCombinations(false)
  useHotkeys('n', handleNext)
  useHotkeys('b', handleBack)

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
            <div>
              <Button className="me-2" size="sm" onClick={handleBack}>
                Back
              </Button>
              <Button size="sm" onClick={handleNext}>
                Next
              </Button>
            </div>
          </Col>
        </Row>
        {selection}
      </Tab>
      <Tab eventKey="filter" title="Config">
        <CheckBoxGroups
          lists={[
            {
              heading: 'Galleries',
              allItems: allGalleries,
              selectedItems: selectedGalleries
            },
            { heading: 'Tags', allItems: allTags, selectedItems: selectedTags },
            { heading: 'Videos', allItems: allVideos, selectedItems: selectedVideos }
          ]}
          saveHandlers={[setSelectedGalleries, setSelectedTags, setSelectedVideos]}
          postSave={async ([selectedGalleries, selectedTags, selectedVideos]) => {
            setShowVid(false)
            await generateCombinations(selectedVideos, selectedTags, selectedGalleries)
          }}
        />
      </Tab>
    </Tabs>
  )
}
