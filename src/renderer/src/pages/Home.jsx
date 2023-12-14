import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Context } from '../App'
import HomeView from '../views/home/Home'

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

  return (
    <HomeView
      activeTab={activeTab}
      setIsVideoPlaying={setIsVideoPlaying}
      setActiveTab={setActiveTab}
      gs={gs}
      showVid={showVid}
      setShowVid={setShowVid}
      videoPath={videoPath}
      galleryPath={galleryPath}
      handleBack={handleBack}
      handleNext={handleNext}
      isVideoPlaying={isVideoPlaying}
    />
  )
}
