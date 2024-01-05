import _ from 'lodash'
import * as React from 'react'
import { useQueryClient } from 'react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import mainAdapter from '../../mainAdapter.js'
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

export default function App() {
  const [isCheckingExecutables, setIsCheckingExecutables] = React.useState(true)
  const [executablesStatus, setExecutablesStatus] = React.useState([])

  const [isGeneratingCombinations, setIsGeneratingCombinations] = React.useState(false)
  const [selection, setSelection] = React.useState({
    tags: new Set(),
    videos: new Set(),
    galleries: new Set()
  })
  const [combinations, setCombinations] = React.useState([])
  const [combinationIndex, setCombinationIndex] = React.useState(0)

  const queryClient = useQueryClient()
  const availableVideos = useAvailableVideos()
  const availableTags = useAvailableTags()
  const availableGalleries = useAvailableGalleries()

  async function saveSelection(videos, tags, galleries) {
    setSelection({
      tags: tags,
      videos: videos,
      galleries: galleries
    })
    await generateCombinations(videos, tags, galleries)
  }

  async function generateCombinations(videos, tags, galleries) {
    setIsGeneratingCombinations(true)
    setCombinations(_.shuffle(await mainAdapter.getCombinationsData(videos, tags, galleries)))
    setCombinationIndex(0)
    setIsGeneratingCombinations(false)
  }

  async function refreshCombinations() {
    queryClient.invalidateQueries(['availableVideos'])
    queryClient.invalidateQueries(['allVideos'])
    queryClient.invalidateQueries(['availableGalleries'])
    queryClient.invalidateQueries(['allGalleries'])
    queryClient.invalidateQueries(['availableTags'])
    queryClient.invalidateQueries(['allTags'])
    const [videos, tags, galleries] = (
      await Promise.all([
        availableVideos.refetch(),
        availableTags.refetch(),
        availableGalleries.refetch()
      ])
    ).map((item) => new Set(item.data))

    await saveSelection(videos, new Set(), galleries)
  }

  React.useEffect(() => {
    if (availableVideos.isSuccess && availableTags.isSuccess && availableGalleries.isSuccess) {
      saveSelection(new Set(availableVideos.data), new Set(), new Set(availableGalleries.data))
    }
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
    <HashRouter basename="/">
      <Routes>
        <Route element={<Layout refreshCombinations={refreshCombinations} />}>
          <Route
            exact
            path="/"
            element={
              <Home
                selection={selection}
                saveSelection={saveSelection}
                combinations={combinations}
                combinationIndex={combinationIndex}
                setCombinationIndex={setCombinationIndex}
                isGeneratingCombinations={isGeneratingCombinations}
              />
            }
          />
          <Route path="/video/:videoPath" element={<Video />} />
          <Route exact path="/videos" element={<Videos />} />
          <Route path="/gallery/:galleryPath" element={<Gallery />} />
          <Route exact path="/galleries" element={<Galleries />} />
          <Route path="/tag/:tagTitle" element={<Tag />} />
          <Route exact path="/tags" element={<Tags />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
