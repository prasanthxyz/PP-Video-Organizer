import _ from 'lodash'
import * as React from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { HashRouter, Route, Routes } from 'react-router-dom'
import mainAdapter from '../../mainAdapter.js'
import Galleries from './pages/Galleries.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import Tag from './pages/Tag.jsx'
import Tags from './pages/Tags.jsx'
import Video from './pages/Video.jsx'
import Videos from './pages/Videos.jsx'
import { getExecutablesStatus } from './utils.js'

export const Context = React.createContext(null)

function App() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasDataChanged, setHasDataChanged] = React.useState(true)
  const [areExecutablesPresent, setAreExecutablesPresent] = React.useState([true, true, true, true])
  const [allCombinations, setAllCombinations] = React.useState([])
  const [combinationIndex, setCombinationIndex] = React.useState(0)
  const [allVideos, setAllVideos] = React.useState([])
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const [allTags, setAllTags] = React.useState([])
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [allGalleries, setAllGalleries] = React.useState([])
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())

  React.useEffect(() => {
    setData()
  }, [])

  const setData = async () => {
    const areExecutablesPresent = await getExecutablesStatus()
    setAreExecutablesPresent(areExecutablesPresent)
    if (areExecutablesPresent.includes(false)) {
      setIsLoading(false)
      return
    }

    await loadDataIfChanged()
  }

  const loadDataIfChanged = async () => {
    if (!hasDataChanged) return

    setIsLoading(true)
    setAllTags((await mainAdapter.getDbTags()).map((tag) => tag.title))
    setSelectedTags(new Set())

    const allDbGalleries = (await mainAdapter.getDbGalleries()).map((g) => g.galleryPath)
    const isGalleryExisting = await Promise.all(allDbGalleries.map(mainAdapter.isDirExisting))
    const availableGalleries = allDbGalleries.filter((gallery, index) => isGalleryExisting[index])
    setAllGalleries(availableGalleries)
    setSelectedGalleries(new Set(availableGalleries))

    const allDbVideos = (await mainAdapter.getDbVideos()).map((dbVideo) => dbVideo.filePath)
    const isVideoExisting = await Promise.all(allDbVideos.map(mainAdapter.isFileExisting))
    const availableVideos = allDbVideos.filter((videoPath, index) => isVideoExisting[index])
    setAllVideos(availableVideos)
    setSelectedVideos(new Set(availableVideos))

    await generateCombinations(new Set(availableVideos), new Set(), new Set(availableGalleries))
    setHasDataChanged(false)
    setIsLoading(false)
  }

  const generateCombinations = async (videos, tags, galleries) => {
    const allCombinations = _.shuffle(
      await mainAdapter.getCombinationsData(videos, tags, galleries)
    )
    setAllCombinations(allCombinations)
    setCombinationIndex(0)
  }

  if (isLoading)
    return (
      <Container fluid>
        <Row className="d-flex align-items-center" style={{ height: '90vh' }}>
          <Col className="text-center">
            <div>Loading...</div>
          </Col>
        </Row>
      </Container>
    )

  if (areExecutablesPresent.includes(false)) {
    const packagesToInstall = [
      ['ffmpeg', 'https://ffmpeg.org/', 'link'],
      ['python', 'https://www.python.org/', 'link'],
      ['pip', 'https://pip.pypa.io/en/stable/installation/', 'link'],
      ['vcsi', 'python -m pip install vcsi', 'code']
    ].filter((item, index) => !areExecutablesPresent[index])

    return (
      <Container fluid>
        <Row className="d-flex align-items-center" style={{ height: '90vh' }}>
          <Col>
            <Row>
              <Col className="d-flex justify-content-center">
                <div className="mb-3">Please ensure these are installed and available in PATH</div>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center">
              <Col xs={5}>
                <Table>
                  <tbody>
                    {packagesToInstall.map(([name, instr, type]) => (
                      <tr key={name}>
                        <td>{name}</td>
                        <td>
                          {type === 'code' ? <code>{instr}</code> : <a href={instr}>{instr}</a>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Context.Provider
      value={{
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
        setHasDataChanged,
        hasDataChanged,
        loadDataIfChanged
      }}
    >
      <HashRouter basename="/">
        <Routes>
          <Route element={<Layout />}>
            <Route exact path="/" element={<Home />} />
            <Route path="/video/:videoPath" element={<Video />} />
            <Route exact path="/videos" element={<Videos />} />
            <Route path="/gallery/:galleryPath" element={<Gallery />} />
            <Route exact path="/galleries" element={<Galleries />} />
            <Route path="/tag/:tagTitle" element={<Tag />} />
            <Route exact path="/tags" element={<Tags />} />
          </Route>
        </Routes>
      </HashRouter>
    </Context.Provider>
  )
}

export default App
