import * as React from 'react'
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap'
import { useHotkeys } from 'react-hotkeys-hook'
import { Link } from 'react-router-dom'
import { Context } from '../App'
import CheckBoxGroups from '../components/CheckBoxGroups'
import RPS from '../components/RPS'
import { getImgPathAndVideoName, getNameAndPathComponents } from '../utils'

export default function Home() {
  const [activeTab, setActiveTab] = React.useState('watch')
  const [showVid, setShowVid] = React.useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  const gs = React.useContext(Context)

  React.useEffect(() => {
    gs.loadDataIfChanged()
  }, [gs.hasDataChanged])

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
    if (gs.allCombinations.length === 0) return
    setIsVideoPlaying(false)
    let newIndex = gs.combinationIndex + (next ? 1 : -1)
    if (newIndex < 0) newIndex += gs.allCombinations.length
    gs.setCombinationIndex(newIndex % gs.allCombinations.length)
    setShowVid(false)
  }
  const handleNext = () => navigateCombinations(true)
  const handleBack = () => navigateCombinations(false)
  useHotkeys('n', handleNext)
  useHotkeys('b', handleBack)

  const videoPath = gs.allCombinations.length > 0 ? gs.allCombinations[gs.combinationIndex][0] : ''
  const galleryPath =
    gs.allCombinations.length > 0 ? gs.allCombinations[gs.combinationIndex][1] : ''

  const controlBar =
    gs.allCombinations.length === 0 ? (
      <></>
    ) : (
      <>
        <Col xs={9} className="d-flex justify-content-between">
          <Button size="sm" variant="success" onClick={() => setShowVid(!showVid)}>
            {showVid ? 'Show TGP' : 'Show Video'}
          </Button>
          <Link to={`/video/${videoPath}`} className="fs-6">
            {getImgPathAndVideoName(videoPath).videoName}
          </Link>
        </Col>
        <Col xs={3} className="d-flex justify-content-between">
          <Link to={`/gallery/${galleryPath}`} className="fs-6">
            {getNameAndPathComponents(galleryPath)[0]}
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
      </>
    )

  const selectedCombination = (
    <Col>
      {gs.allCombinations.length === 0 ? (
        'No combination found!'
      ) : (
        <RPS
          combination={gs.allCombinations[gs.combinationIndex]}
          showVid={showVid}
          isVideoPlaying={isVideoPlaying}
        />
      )}
    </Col>
  )

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => {
        setIsVideoPlaying(false)
        setActiveTab(tab)
      }}
    >
      <Tab eventKey="watch" title="Watch">
        <Row className="my-1">{controlBar}</Row>
        <Row>{selectedCombination}</Row>
      </Tab>
      <Tab eventKey="filter" title="Config">
        <CheckBoxGroups
          lists={[
            {
              heading: 'Galleries',
              allItems: gs.allGalleries,
              selectedItems: gs.selectedGalleries
            },
            {
              heading: 'Tags',
              allItems: gs.allTags,
              selectedItems: gs.selectedTags
            },
            {
              heading: 'Videos',
              allItems: gs.allVideos,
              selectedItems: gs.selectedVideos
            }
          ]}
          saveHandlers={[gs.setSelectedGalleries, gs.setSelectedTags, gs.setSelectedVideos]}
          postSave={async ([selectedGalleries, selectedTags, selectedVideos]) => {
            setShowVid(false)
            await gs.generateCombinations(selectedVideos, selectedTags, selectedGalleries)
          }}
        />
      </Tab>
    </Tabs>
  )
}
