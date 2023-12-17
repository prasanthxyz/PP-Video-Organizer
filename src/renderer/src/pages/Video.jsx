import * as React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useParams } from 'react-router'
import mainAdapter from '../../../mainAdapter'
import { Context } from '../App'
import { getImgPathAndVideoName } from '../utils'
import VideoView from '../views/videos/Video'

export default function Video() {
  const [tgpExists, setTgpExists] = React.useState(false)
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)
  const [selectedTags, setSelectedTags] = React.useState(new Set())
  const [selectedGalleries, setSelectedGalleries] = React.useState(new Set())
  const [activeTab, setActiveTab] = React.useState('video')
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)

  const { allTags, allGalleries, hasDataChanged, loadDataIfChanged } = React.useContext(Context)

  React.useEffect(() => {
    loadDataIfChanged()
  }, [hasDataChanged])

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

  const setFilesExist = async () => {
    setTgpExists(await mainAdapter.isTgpExisting(videoPath))
    const videoData = await mainAdapter.getDbVideoData(videoPath)
    setSelectedTags(new Set(videoData['tags'].map((tag) => tag.title)))
    setSelectedGalleries(new Set(videoData['galleries'].map((gallery) => gallery.galleryPath)))
  }

  React.useEffect(() => {
    setFilesExist()
  }, [])

  const handleGenerateTgp = async () => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(videoPath)
    setTgpExists(true)
    setIsGeneratingTgp(false)
  }

  const { imgPath, videoName } = getImgPathAndVideoName(videoPath)

  return (
    <VideoView
      videoName={videoName}
      activeTab={activeTab}
      setIsVideoPlaying={setIsVideoPlaying}
      setActiveTab={setActiveTab}
      isVideoPlaying={isVideoPlaying}
      videoPath={videoPath}
      tgpExists={tgpExists}
      imgPath={imgPath}
      isGeneratingTgp={isGeneratingTgp}
      handleGenerateTgp={handleGenerateTgp}
      allTags={allTags}
      selectedTags={selectedTags}
      allGalleries={allGalleries}
      selectedGalleries={selectedGalleries}
      setSelectedTags={setSelectedTags}
      setSelectedGalleries={setSelectedGalleries}
    />
  )
}
