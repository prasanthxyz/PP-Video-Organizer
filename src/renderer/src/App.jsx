import * as React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useAvailableGalleries } from './hooks/galleries.js'
import { useAvailableTags } from './hooks/tags.js'
import { useAvailableVideos } from './hooks/videos.js'
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

  const [selectedVideos, setSelectedVideos] = React.useState(new Set())
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())

  const availableVideos = useAvailableVideos()
  const availableTags = useAvailableTags()
  const availableGalleries = useAvailableGalleries()

  React.useEffect(() => {
    const loadInitialSelection = async () => {
      setSelectedTags(new Set())
      setSelectedGalleries(new Set(availableGalleries.data))
      setSelectedVideos(new Set(availableVideos.data))
    }

    if (availableVideos.isSuccess && availableTags.isSuccess && availableGalleries.isSuccess)
      loadInitialSelection()
  }, [availableVideos.isSuccess, availableTags.isSuccess, availableGalleries.isSuccess])

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

  if (availableVideos.isLoading || availableTags.isLoading || availableGalleries.isLoading) {
    return <CenterMessage msg="Loading..." />
  }

  return (
    <Context.Provider
      value={{
        selectedVideos,
        setSelectedVideos,
        selectedTags,
        setSelectedTags,
        selectedGalleries,
        setSelectedGalleries
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
