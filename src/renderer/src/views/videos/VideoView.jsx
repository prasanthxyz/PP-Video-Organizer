import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap'
import CheckBoxGroups from '../../components/CheckBoxGroups'
import VideoPlayer from '../../components/VideoPlayer'
import SpinnerOr from '../common/SpinnerOr'

const VideoView = ({
  video,
  activeTab,
  setActiveTab,
  isVideoPlaying,
  setIsVideoPlaying,
  isGeneratingTgp,
  handleGenerateTgp,
  updateVideoRelations,
  allItems,
  selectedItems,
  setSelectedItems
}) => (
  <Row>
    <Col>
      <Row>
        <Col>
          <h6 className="fs-6">{video.videoName}</h6>
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
                    sources={`file:///${video.id}`}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col className="mx-auto" xs={9}>
                  {video.id}
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="tgp" title="TGP">
              <Row className="mt-3">
                <Col className="d-flex justify-content-center">
                  {video.isTgpAvailable ? (
                    <img className="mh-100 mw-100" src={`file:///${video.tgpPath}`} />
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
                    allItems: allItems.tags.map((t) => t.id),
                    selectedItems: selectedItems.tags
                  },
                  {
                    heading: 'Galleries',
                    allItems: allItems.galleries.map((g) => g.id),
                    selectedItems: selectedItems.galleries
                  }
                ]}
                saveHandlers={[setSelectedItems.tags, setSelectedItems.galleries]}
                postSave={async ([tagsDiffObj, galleriesDiffObj]) => {
                  await updateVideoRelations([video.id, tagsDiffObj, galleriesDiffObj])
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

export default VideoView
