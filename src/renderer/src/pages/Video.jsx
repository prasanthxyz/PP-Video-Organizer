import * as React from 'react'
import { Button, Col, Row, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useHotkeys } from 'react-hotkeys-hook'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { Context } from '../App'
import CheckBoxGroups from '../components/CheckBoxGroups'
import VideoPlayer from '../components/VideoPlayer'
import { getImgPathAndVideoName } from '../utils'

export default function Video() {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())
  const [activeTab, setActiveTab] = React.useState('video')
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  const { allTags, allGalleries, hasDataChanged, loadDataIfChanged } = React.useContext(Context)

  React.useEffect(() => {
    loadDataIfChanged()
  }, [hasDataChanged])

  useHotkeys('v', () => {
    if (activeTab === 'video') return
    setIsVideoPlaying(false)
    setActiveTab('video')
  })
  useHotkeys('t', () => {
    if (activeTab === 'tgp') return
    setIsVideoPlaying(false)
    setActiveTab('tgp')
  })
  useHotkeys('a', () => {
    if (activeTab === 'relations') return
    setIsVideoPlaying(false)
    setActiveTab('relations')
  })
  useHotkeys('p', () => {
    if (activeTab !== 'video') {
      setActiveTab('video')
      setIsVideoPlaying(true)
    } else {
      setIsVideoPlaying(!isVideoPlaying)
    }
  })

  let { videoPath } = useParams()

  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath))
    const videoData = await mainAdapter.getDbVideoData(videoPath)
    setSelectedTags(new Set(videoData['tags'].map((tag) => tag.title)))
    setSelectedGalleries(new Set(videoData['galleries'].map((gallery) => gallery.galleryPath)))
  }

  React.useEffect(() => {
    setFilesExist()
  }, [])

  const handleGenerateTgp = async () => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(videoPath, false)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const { imgPath, videoName } = getImgPathAndVideoName(videoPath)

  const tgpButton = tgpExists ? (
    <></>
  ) : isGeneratingTgp ? (
    <Spinner className="mt-3 mb-4" />
  ) : (
    <Button
      variant="success"
      size="sm"
      className="mt-3 mb-4"
      onClick={async () => await handleGenerateTgp()}
    >
      Generate TGP
    </Button>
  )

  const relatedItems = (
    <CheckBoxGroups
      lists={[
        {
          heading: 'Tags',
          allItems: allTags,
          selectedItems: selectedTags
        },
        {
          heading: 'Galleries',
          allItems: allGalleries,
          selectedItems: selectedGalleries
        }
      ]}
      saveHandlers={[setSelectedTags, setSelectedGalleries]}
      postSave={async ([tagsDiffObj, galleriesDiffObj]) => {
        await mainAdapter.updateDbVideoTags(videoPath, tagsDiffObj)
        await mainAdapter.updateDbVideoGalleries(videoPath, galleriesDiffObj)
      }}
      useDiffObj={true}
    />
  )

  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <h6 className="fs-6">{videoName}</h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs
              activeKey={activeTab}
              onSelect={(tab) => {
                setIsVideoPlaying(false)
                setActiveTab(tab)
              }}
            >
              <Tab eventKey="video" title="Video">
                <Row>
                  <Col xs={9} className="mx-auto mt-2">
                    <VideoPlayer autoplay={isVideoPlaying} controls={true} sources={videoPath} />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col className="mx-auto" xs={9}>
                    {videoPath}
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="tgp" title="TGP">
                <Row>
                  <Col className="d-flex justify-content-center">
                    {tgpExists ? (
                      <img className="mh-100 mw-100" src={`file:///${imgPath}`} />
                    ) : (
                      tgpButton
                    )}
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="relations" title="Associations">
                {relatedItems}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
