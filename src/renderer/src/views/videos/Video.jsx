import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap'
import CheckBoxGroups from '../../components/CheckBoxGroups'
import VideoPlayer from '../../components/VideoPlayer'
import SpinnerOr from '../common/SpinnerOr'

function Video({
  videoName,
  activeTab,
  setIsVideoPlaying,
  setActiveTab,
  isVideoPlaying,
  videoPath,
  tgpExists,
  imgPath,
  isGeneratingTgp,
  handleGenerateTgp,
  allTags,
  selectedTags,
  allGalleries,
  selectedGalleries,
  setSelectedTags,
  setSelectedGalleries,
  updateVideoGalleries,
  updateVideoTags
}) {
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
                    <VideoPlayer
                      autoplay={isVideoPlaying}
                      controls={true}
                      sources={`file:///${videoPath}`}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col className="mx-auto" xs={9}>
                    {videoPath}
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="tgp" title="TGP">
                <Row className="mt-3">
                  <Col className="d-flex justify-content-center">
                    {tgpExists ? (
                      <img className="mh-100 mw-100" src={`file:///${imgPath}`} />
                    ) : (
                      <SpinnerOr isSpinner={isGeneratingTgp} msg="Generating TGP...">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={async () => await handleGenerateTgp()}
                        >
                          Generate TGP
                        </Button>
                      </SpinnerOr>
                    )}
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="relations" title="Associations">
                <CheckBoxGroups
                  lists={[
                    {
                      heading: 'Tags',
                      allItems: allTags.map((t) => t.id),
                      selectedItems: selectedTags
                    },
                    {
                      heading: 'Galleries',
                      allItems: allGalleries.map((g) => g.id),
                      selectedItems: selectedGalleries
                    }
                  ]}
                  saveHandlers={[setSelectedTags, setSelectedGalleries]}
                  postSave={async ([tagsDiffObj, galleriesDiffObj]) => {
                    await updateVideoTags([videoPath, tagsDiffObj])
                    await updateVideoGalleries([videoPath, galleriesDiffObj])
                  }}
                  useDiffObj={true}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Video
