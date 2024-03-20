import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { UseMutateFunction } from 'react-query'
import { useParams } from 'react-router'
import { IGallery, IGalleryModel, ITag, ITagModel, IVideoWithRelated } from '../../../types'
import { useAllGalleries } from '../hooks/galleries'
import { useAllTags } from '../hooks/tags'
import { useGenerateTgp, useUpdateVideoRelations, useVideo } from '../hooks/videos'
import CenterMessage from '../views/app/CenterMessage'
import VideoView from '../views/videos/VideoView'

export default function Video(): JSX.Element {
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(new Set())
  const [selectedGalleries, setSelectedGalleries] = React.useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = React.useState('video')
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  let { videoPath } = useParams()
  videoPath = decodeURIComponent(videoPath as string)
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
      setSelectedTags(new Set(video.data.tags.map((tag: ITagModel) => tag.title)))
      setSelectedGalleries(
        new Set(video.data.galleries.map((gallery: IGalleryModel) => gallery.galleryPath))
      )
    }
  }, [video.isSuccess])

  const handleTabClick = (newTabId: string): void => {
    setIsVideoPlaying(false)
    setActiveTab(newTabId)
  }

  if (video.isLoading || allGalleries.isLoading || allTags.isLoading)
    return <CenterMessage msg="Loading..." />

  return (
    <VideoView
      video={video.data as IVideoWithRelated}
      activeTab={activeTab}
      isVideoPlaying={isVideoPlaying}
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
      updateVideoRelations={updateVideoRelations}
      handleTabClick={handleTabClick}
    />
  )
}
