import _ from 'lodash'
import * as React from 'react'
import { useQueryClient } from 'react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { IVideo } from 'src/types'
import { useAllGalleries } from './hooks/galleries'
import { useAllTags } from './hooks/tags'
import { useExecutablesStatus } from './hooks/utils'
import { useAllVideos } from './hooks/videos'
import Galleries from './pages/Galleries'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Tag from './pages/Tag'
import Tags from './pages/Tags'
import Video from './pages/Video'
import Videos from './pages/Videos'
import CenterMessage from './views/app/CenterMessage'
import MissingExecutables from './views/app/MissingExecutables'

export const AppContext = React.createContext(null)

export default function App(): JSX.Element {
  const queryClient = useQueryClient()

  const [isBigScreen, setIsBigScreen] = React.useState(checkIsBigScreen())
  const executablesStatus = useExecutablesStatus()

  const [selection, setSelection] = React.useState({
    tags: new Set<string>(),
    videos: new Set<string>(),
    galleries: new Set<string>()
  })
  const [combinationIndex, setCombinationIndex] = React.useState(0)

  const allVideos = useAllVideos()
  const allGalleries = useAllGalleries()
  const allTags = useAllTags()

  async function saveSelection(
    videos: Set<string>,
    tags: Set<string>,
    galleries: Set<string>
  ): Promise<void> {
    setSelection({
      tags,
      videos,
      galleries
    })
    setCombinationIndex(0)
  }

  async function refreshCombinations(): Promise<void> {
    await Promise.all([
      queryClient.invalidateQueries(['allVideos']),
      queryClient.invalidateQueries(['allGalleries']),
      queryClient.invalidateQueries(['allTags'])
    ])
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    function autoResize(): void {
      setIsBigScreen(checkIsBigScreen())
    }
    window.addEventListener('resize', autoResize)
    return () => window.removeEventListener('resize', autoResize)
  }, [])

  React.useEffect(() => {
    if (allVideos.isSuccess && allTags.isSuccess && allGalleries.isSuccess) {
      const videos = new Set(
        allVideos.data
          ?.filter((video) => video.isAvailable && video.isTgpAvailable)
          .map((video) => video.id) || []
      )
      const galleries = new Set(
        allGalleries.data
          ?.filter((gallery) => gallery.isAvailable && gallery.images.length > 0)
          .map((gallery) => gallery.id) || []
      )
      saveSelection(new Set(videos), new Set(), new Set(galleries))
    }
  }, [allVideos.dataUpdatedAt, allTags.dataUpdatedAt, allGalleries.dataUpdatedAt])

  const combinations = React.useMemo(
    () =>
      getCombinations(allVideos.data || [], selection.videos, selection.tags, selection.galleries),
    [selection]
  )

  if (!isBigScreen) {
    return (
      <CenterMessage
        msg={
          <div>
            This app is optimized for bigger screen sizes
            <br />
            Please use a bigger screen and/or maximize the window
          </div>
        }
      />
    )
  }

  if (executablesStatus.isLoading) {
    return <CenterMessage msg="Checking Executables..." />
  }

  if ((executablesStatus.data || []).includes(false)) {
    const packagesToInstall = [['ffmpeg', 'https://ffmpeg.org/', 'link']].filter(
      (_item, index) => !executablesStatus[index]
    )

    return <MissingExecutables packagesToInstall={packagesToInstall} />
  }

  if (allVideos.isLoading || allGalleries.isLoading || allTags.isLoading) {
    return <CenterMessage msg="Loading..." />
  }

  return (
    <HashRouter basename="/">
      <Routes>
        <Route element={<Layout refreshCombinations={refreshCombinations} />}>
          <Route
            path="/"
            element={
              <Home
                selection={selection}
                saveSelection={saveSelection}
                combinations={combinations}
                combinationIndex={combinationIndex}
                setCombinationIndex={setCombinationIndex}
              />
            }
          />
          <Route path="/video/:videoPath" element={<Video />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/gallery/:galleryPath" element={<Gallery />} />
          <Route path="/galleries" element={<Galleries />} />
          <Route path="/tag/:tagTitle" element={<Tag />} />
          <Route path="/tags" element={<Tags />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

function checkIsBigScreen(): boolean {
  return typeof window === 'undefined' || window.innerWidth >= 768
}

function getCombinations(
  allVideos: IVideo[],
  selectedVideos: Set<string>,
  selectedTags: Set<string>,
  selectedGalleries: Set<string>
): [string, string][] {
  const combinations: [string, string][] = []
  for (const video of allVideos) {
    if (!selectedVideos.has(video.filePath)) continue

    const commonTags = video.tags.filter((tag) => selectedTags.has(tag))
    const commonGalleries = video.galleries.filter((gallery) => selectedGalleries.has(gallery))
    if (commonTags.length !== selectedTags.size || commonGalleries.length === 0) continue

    for (const gallery of commonGalleries) {
      combinations.push([video.filePath, gallery])
    }
  }

  return _.shuffle(combinations)
}
