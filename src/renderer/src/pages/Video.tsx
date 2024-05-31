import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { UseMutateFunction } from 'react-query'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { IGallery, ITag, IVideo } from '../../../types'
import { useAllGalleries } from '../hooks/galleries'
import { useAllTags } from '../hooks/tags'
import {
  useDeleteVideo,
  useGenerateTgp,
  useUpdateVideoGalleries,
  useUpdateVideoTags,
  useVideo
} from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import VideoView from '../views/videos/VideoView'

export default function Video(): JSX.Element {
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(new Set())
  const [selectedGalleries, setSelectedGalleries] = React.useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = React.useState('galleries')
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)
  const [isVideoShown, setIsVideoShown] = React.useState(false)

  let { videoPath } = useParams()
  videoPath = decodeURIComponent(videoPath as string)
  const video = useVideo(videoPath)
  const allTags = useAllTags()
  const allGalleries = useAllGalleries()

  const updateVideoGalleries = useUpdateVideoGalleries()
  const updateVideoTags = useUpdateVideoTags()
  const [generateTgp, isGeneratingTgp] = useGenerateTgp()
  const deleteVideo = useDeleteVideo()

  const navigate = useNavigate()

  useHotkeys('g', () => {
    if (activeTab === 'galleries') return
    setIsVideoPlaying(false)
    setActiveTab('galleries')
  })
  useHotkeys('t', () => {
    if (activeTab === 'tags') return
    setIsVideoPlaying(false)
    setActiveTab('tags')
  })
  useHotkeys('p', () => {
    toggleVideo()
  })

  React.useEffect(() => {
    if (video.isSuccess) {
      setSelectedTags(new Set(video.data.tags))
      setSelectedGalleries(new Set(video.data.galleries))
    }
  }, [video.data])

  const handleTabClick = (newTabId: string): void => {
    setIsVideoPlaying(false)
    setActiveTab(newTabId)
  }

  const toggleVideo = (): void => {
    if (isVideoShown) {
      setIsVideoPlaying(false)
      setIsVideoShown(false)
    } else {
      setIsVideoPlaying(true)
      setIsVideoShown(true)
    }
  }

  if (video.isLoading || allGalleries.isLoading || allTags.isLoading)
    return <CenterMessage msg="Loading..." />

  return (
    <VideoView
      video={video.data as IVideo}
      activeTab={activeTab}
      isVideoPlaying={isVideoPlaying}
      isVideoShown={isVideoShown}
      toggleVideo={toggleVideo}
      deleteVideo={deleteVideo}
      isGeneratingTgp={isGeneratingTgp as boolean}
      handleGenerateTgp={generateTgp as UseMutateFunction<unknown, unknown, string, unknown>}
      allItems={{
        tags: allTags.data as ITag[],
        galleries: allGalleries.data as IGallery[]
      }}
      selectedItems={{ tags: selectedTags, galleries: selectedGalleries }}
      setSelectedItems={{
        tags: setSelectedTags,
        galleries: setSelectedGalleries
      }}
      updateVideoGalleries={updateVideoGalleries}
      updateVideoTags={updateVideoTags}
      handleTabClick={handleTabClick}
      navigate={navigate}
    />
  )
}
