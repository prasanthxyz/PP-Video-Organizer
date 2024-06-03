import * as React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import useRelations from './hooks/relations'
import { useExecutablesStatus } from './hooks/utils'
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
  const [isBigScreen, setIsBigScreen] = React.useState(checkIsBigScreen())
  const executablesStatus = useExecutablesStatus()

  const {
    selection,
    combinations,
    combinationIndex,
    setCombinationIndex,
    saveSelection,
    refreshCombinations,
    isGeneratingCombinations
  } = useRelations()

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    function autoResize(): void {
      setIsBigScreen(checkIsBigScreen())
    }
    window.addEventListener('resize', autoResize)
    return () => window.removeEventListener('resize', autoResize)
  }, [])

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

  if (isGeneratingCombinations) {
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
