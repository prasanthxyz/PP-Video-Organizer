import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Context } from '../App'
import { useAvailableGalleries } from '../hooks/galleries'
import { useAvailableTags } from '../hooks/tags'
import { useAvailableVideos } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import HomeView from '../views/home/Home'

export default function Home() {
  const [activeTab, setActiveTab] = React.useState('watch')
  const [showVid, setShowVid] = React.useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  const availableVideos = useAvailableVideos().data || []
  const availableTags = useAvailableTags().data || []
  const availableGalleries = useAvailableGalleries().data || []

  const {
    selection,
    saveSelection,
    combinations,
    combinationIndex,
    setCombinationIndex,
    hasDataChanged,
    setHasDataChanged,
    isGeneratingCombinations
  } = React.useContext(Context)

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
    if (combinations.length === 0) return
    setIsVideoPlaying(false)
    let newIndex = combinationIndex + (next ? 1 : -1)
    if (newIndex < 0) newIndex += combinations.length
    setCombinationIndex(newIndex % combinations.length)
    setShowVid(false)
  }
  const handleNext = () => navigateCombinations(true)
  const handleBack = () => navigateCombinations(false)
  useHotkeys('n', handleNext)
  useHotkeys('b', handleBack)

  const videoPath = combinations.length > 0 ? combinations[combinationIndex][0] : ''
  const galleryPath = combinations.length > 0 ? combinations[combinationIndex][1] : ''

  if (isGeneratingCombinations) {
    return <CenterMessage msg="Generating combinations..." />
  }

  return (
    <HomeView
      activeTab={activeTab}
      setIsVideoPlaying={setIsVideoPlaying}
      setActiveTab={setActiveTab}
      availableVideos={availableVideos}
      availableTags={availableTags}
      availableGalleries={availableGalleries}
      selection={selection}
      saveSelection={saveSelection}
      combinations={combinations}
      combinationIndex={combinationIndex}
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
