import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useAllGalleries } from '../hooks/galleries'
import { useAllTags } from '../hooks/tags'
import { useAllVideos } from '../hooks/videos'
import HomeView from '../views/home/HomeView'

export default function Home({
  selection,
  saveSelection,
  combinations,
  combinationIndex,
  setCombinationIndex
}: {
  selection: { tags: Set<string>; videos: Set<string>; galleries: Set<string> }
  saveSelection: (videos: Set<string>, tags: Set<string>, galleries: Set<string>) => Promise<void>
  combinations: [string, string][]
  combinationIndex: number
  setCombinationIndex: React.Dispatch<React.SetStateAction<number>>
}): JSX.Element {
  const [activeTab, setActiveTab] = React.useState('watch')
  const [showVid, setShowVid] = React.useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  const availableVideos: string[] =
    useAllVideos()
      .data?.filter((video) => video.isAvailable && video.isTgpAvailable)
      .map((video) => video.id) || []
  const availableTags = useAllTags().data?.map((tag) => tag.id) || []
  const availableGalleries =
    useAllGalleries()
      .data?.filter((gallery) => gallery.isAvailable && gallery.images.length > 0)
      .map((gallery) => gallery.id) || []

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

  const handleTabClick = (newTab: string): void => {
    setIsVideoPlaying(false)
    setActiveTab(newTab)
  }

  const navigateCombinations = (next = true): void => {
    if (activeTab !== 'watch') setActiveTab('watch')
    if (combinations.length === 0) return
    setIsVideoPlaying(false)
    let newIndex = combinationIndex + (next ? 1 : -1)
    if (newIndex < 0) newIndex += combinations.length
    setCombinationIndex(newIndex % combinations.length)
    setShowVid(false)
  }
  const handleNext = (): void => navigateCombinations(true)
  const handleBack = (): void => navigateCombinations(false)
  useHotkeys('n', handleNext)
  useHotkeys('b', handleBack)

  return (
    <HomeView
      activeTab={activeTab}
      availableItems={{
        videos: availableVideos,
        tags: availableTags,
        galleries: availableGalleries
      }}
      selection={selection}
      saveSelection={saveSelection}
      combination={combinations.length === 0 ? null : combinations[combinationIndex]}
      showVid={showVid}
      setShowVid={setShowVid}
      handleBack={handleBack}
      handleNext={handleNext}
      isVideoPlaying={isVideoPlaying}
      setIsVideoPlaying={setIsVideoPlaying}
      handleTabClick={handleTabClick}
    />
  )
}
