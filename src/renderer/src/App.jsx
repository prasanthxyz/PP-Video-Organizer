import _ from 'lodash'
import * as React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import mainAdapter from '../../mainAdapter.js'
import useAvailableGalleries from './hooks/galleries.js'
import useAvailableTags from './hooks/tags.js'
import useAvailableVideos from './hooks/videos.js'
import Galleries from './pages/Galleries.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import Tag from './pages/Tag.jsx'
import Tags from './pages/Tags.jsx'
import Video from './pages/Video.jsx'
import Videos from './pages/Videos.jsx'
import { getExecutablesStatus } from './utils.js'
import CenterMessage from './views/app/CenterMessage.jsx'
import MissingExecutables from './views/app/MissingExecutables.jsx'

export const Context = React.createContext(null)

function App() {
  const [isCheckingExecutables, setIsCheckingExecutables] = React.useState(true)
  const [executablesStatus, setExecutablesStatus] = React.useState([true, true, true, true])

  const [hasDataChanged, setHasDataChanged] = React.useState(true)
  const [allCombinations, setAllCombinations] = React.useState([])
  const [combinationIndex, setCombinationIndex] = React.useState(0)
  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())

  const availableVideos = useAvailableVideos()
  const availableTags = useAvailableTags()
  const availableGalleries = useAvailableGalleries()

  const loadDataIfChanged = async () => {
    if (!hasDataChanged) return

    const selectedTags = new Set()
    const selectedGalleries = new Set(availableGalleries.data)
    const selectedVideos = new Set(availableVideos.data)

    setSelectedTags(selectedTags)
    setSelectedGalleries(selectedGalleries)
    setSelectedVideos(selectedVideos)
    await generateCombinations(selectedVideos, selectedTags, selectedGalleries)
    setHasDataChanged(false)
  }

  const generateCombinations = async (videos, tags, galleries) => {
    const allCombinations = _.shuffle(
      await mainAdapter.getCombinationsData(videos, tags, galleries)
    )
    setAllCombinations(allCombinations)
    setCombinationIndex(0)
  }

  const checkExecutables = async () => {
    setExecutablesStatus(await getExecutablesStatus())
    setIsCheckingExecutables(false)
  }

  if (isCheckingExecutables) {
    checkExecutables()
    return <CenterMessage msg="Checking Executables..." />
  }

  if (executablesStatus.includes(false)) {
    const packagesToInstall = [
      ['ffmpeg', 'https://ffmpeg.org/', 'link'],
      ['python', 'https://www.python.org/', 'link'],
      ['pip', 'https://pip.pypa.io/en/stable/installation/', 'link'],
      ['vcsi', 'python -m pip install vcsi', 'code']
    ].filter((item, index) => !executablesStatus[index])

    return <MissingExecutables packagesToInstall={packagesToInstall} />
  }

  const isLoading =
    availableVideos.isLoading || availableTags.isLoading || availableGalleries.isLoading

  if (isLoading) {
    return <CenterMessage msg="Loading..." />
  }

  if (selectedGalleries.size !== availableGalleries.data.length) {
    loadDataIfChanged()
    return <CenterMessage msg="Loading..." />
  }

  return (
    <Context.Provider
      value={{
        allCombinations,
        combinationIndex,
        setCombinationIndex,
        selectedVideos,
        setSelectedVideos,
        selectedTags,
        setSelectedTags,
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
