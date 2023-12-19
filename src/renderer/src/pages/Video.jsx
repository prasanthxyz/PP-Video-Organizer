import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useParams } from 'react-router'
import { useAllGalleries } from '../hooks/galleries'
import { useAllTags } from '../hooks/tags'
import { useGenerateTgp, useUpdateVideoRelations, useVideo } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import VideoView from '../views/videos/VideoView'

export default function Video() {
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())
  const [activeTab, setActiveTab] = React.useState('video')
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  let { videoPath } = useParams()
  videoPath = decodeURIComponent(videoPath)
  const video = useVideo(videoPath)
  const allTags = useAllTags()
  const allGalleries = useAllGalleries()

  const updateVideoRelations = useUpdateVideoRelations()
  const [generateTgp, isGeneratingTgp] = useGenerateTgp()

  useHotkeys('v', () => {
    if (activeTab === 'video') return
    setIsVideoPlaying(false)
    setActiveTab('video')
  })
  useHotkeys('t', () => {
    if (activeTab === 'tgp') return
    setIsVideoPlaying(false)
    setActiveTab('tgp')
  })
  useHotkeys('a', () => {
    if (activeTab === 'relations') return
    setIsVideoPlaying(false)
    setActiveTab('relations')
  })
  useHotkeys('p', () => {
    if (activeTab !== 'video') {
      setActiveTab('video')
      setIsVideoPlaying(true)
    } else {
      setIsVideoPlaying(!isVideoPlaying)
    }
  })

  React.useEffect(() => {
    if (video.isSuccess) {
      setSelectedTags(new Set(video.data.tags.map((tag) => tag.title)))
      setSelectedGalleries(new Set(video.data.galleries.map((gallery) => gallery.galleryPath)))
    }
  }, [video.isSuccess])

  if (video.isLoading || allGalleries.isLoading || allTags.isLoading)
    return <CenterMessage msg="Loading..." />

  return (
    <VideoView
      video={video.data}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isVideoPlaying={isVideoPlaying}
      setIsVideoPlaying={setIsVideoPlaying}
      isGeneratingTgp={isGeneratingTgp}
      handleGenerateTgp={generateTgp}
      allItems={{ tags: allTags.data, galleries: allGalleries.data }}
      selectedItems={{ tags: selectedTags, galleries: selectedGalleries }}
      setSelectedItems={{ tags: setSelectedTags, galleries: setSelectedGalleries }}
      updateVideoRelations={updateVideoRelations}
    />
  )
}
