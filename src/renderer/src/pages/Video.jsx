import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { useAllGalleries } from '../hooks/galleries'
import { useAllTags } from '../hooks/tags'
import {
  useGenerateTgp,
  useUpdateVideoGalleries,
  useUpdateVideoTags,
  useVideo
} from '../hooks/videos'
import { getImgPathAndVideoName } from '../utils'
import CenterMessage from '../views/app/CenterMessage'
import VideoView from '../views/videos/Video'

export default function Video() {
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())
  const [activeTab, setActiveTab] = React.useState('video')
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  const allTags = useAllTags().data || []
  const allGalleries = useAllGalleries().data || []

  const updateVideoGalleries = useUpdateVideoGalleries()
  const updateVideoTags = useUpdateVideoTags()

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

  let { videoPath } = useParams()
  videoPath = decodeURIComponent(videoPath)
  const video = useVideo(videoPath)

  const [generateTgp, isGeneratingTgp] = useGenerateTgp()

  React.useEffect(() => {
    if (video.isSuccess) {
      setSelectedTags(new Set(video.data.tags.map((tag) => tag.title)))
      setSelectedGalleries(new Set(video.data.galleries.map((gallery) => gallery.galleryPath)))
    }
  }, [video.isSuccess])

  const { imgPath, videoName } = getImgPathAndVideoName(videoPath)

  if (video.isLoading) return <CenterMessage msg="Loading..." />

  return (
    <VideoView
      videoName={videoName}
      activeTab={activeTab}
      setIsVideoPlaying={setIsVideoPlaying}
      setActiveTab={setActiveTab}
      isVideoPlaying={isVideoPlaying}
      videoPath={videoPath}
      tgpExists={video.data.isTgpAvailable}
      imgPath={imgPath}
      isGeneratingTgp={isGeneratingTgp}
      handleGenerateTgp={generateTgp}
      allTags={allTags}
      selectedTags={selectedTags}
      allGalleries={allGalleries}
      selectedGalleries={selectedGalleries}
      setSelectedTags={setSelectedTags}
      setSelectedGalleries={setSelectedGalleries}
      updateVideoGalleries={updateVideoGalleries}
      updateVideoTags={updateVideoTags}
    />
  )
}
