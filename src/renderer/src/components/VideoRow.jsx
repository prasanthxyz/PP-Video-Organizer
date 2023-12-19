import * as React from 'react'
import { Link } from 'react-router-dom'
import mainAdapter from '../../../mainAdapter'
import { getImgPathAndVideoName } from '../utils'
import VideoRowView from '../views/videos/VideoRow'

export default function VideoRow({ video, deleteVideo, index }) {
  const [isGeneratingTgp, setIsGeneratingTgp] = React.useState(false)

  const handleGenerateTgp = async () => {
    setIsGeneratingTgp(true)
    await mainAdapter.generateTgp(video.filePath)
    setIsGeneratingTgp(false)
  }

  return (
    <VideoRowView
      video={video}
      fileExists={video.isAvailable}
      videoName={getImgPathAndVideoName(video.filePath).videoName}
      deleteVideo={deleteVideo}
      tgpExists={video.isTgpAvailable}
      isGeneratingTgp={isGeneratingTgp}
      handleGenerateTgp={handleGenerateTgp}
    />
  )
}
