import * as React from 'react'
import { useGenerateTgp } from '../hooks/videos'
import { getImgPathAndVideoName } from '../utils'
import VideoRowView from '../views/videos/VideoRow'

export default function VideoRow({ video, deleteVideo, index }) {
  const [generateTgp, isGeneratingTgp] = useGenerateTgp()

  return (
    <VideoRowView
      video={video}
      fileExists={video.isAvailable}
      videoName={getImgPathAndVideoName(video.filePath).videoName}
      deleteVideo={deleteVideo}
      tgpExists={video.isTgpAvailable}
      isGeneratingTgp={isGeneratingTgp}
      handleGenerateTgp={() => generateTgp(video.filePath)}
    />
  )
}
